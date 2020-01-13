const Flowable = require('../utils/react').Flowable;
const Requester = require('../utils/requester').Requester;

const {FonbetSport, FonbetEvent, fonbetSportsDict, api, fonbetSports} = require('./fonbet');
const {Factor, ScopeType, SportEvent, OddsEnums} = require("../odds");

class FonbetOddsParsingService extends Flowable {
  constructor() {
    super();

    this.factorsCatalog = {};
    this.factorsCatalogRequester = new Requester(api.factors, { gzip: true });
    this.factorsCatalogRequester.on("response", rawFactorsCatalog =>
      this.updateFactorsCatalog( JSON.parse(rawFactorsCatalog) ));

    this.subscribedSports = {};
    this.sports = {};
    this.events = {};
    this.updatesRequester = new Requester(api.sport, { gzip: true });
    this.updatesRequester.on("response", rawUpdate => this.handleUpdate( JSON.parse(rawUpdate) ));
  }

  handleUpdate(update) {

    this.updateSports(update.sports);
    this.updateEvents(update.events);

    update.customFactors.forEach( customFactor => {
      const odds = this.makeOdds(customFactor);
      if (odds) this.emit("odds", odds);
    })

  }

  updateSports(sportsUpdates = {}) {
    this.sports = {};
    for (let sportId in this.subscribedSports)
      this.sports[sportId] = this.subscribedSports[sportId];

    sportsUpdates.forEach( sportUpdate => {
      // Add a new Sport if it doesn't already exist
      if (!this.sports.hasOwnProperty(sportUpdate.id))
        this.sports[sportUpdate.id] = new FonbetSport(
          sportUpdate.id, sportUpdate.parentId ? sportUpdate.parentId : 0,
          sportUpdate.kind, sportUpdate.regionId, sportUpdate.name
        )

    });

  }

  updateEvents(eventsUpdates = {}) {
    this.events = {};

    eventsUpdates.forEach( eventUpdate => {

      this.events[eventUpdate.id] = new FonbetEvent(
        eventUpdate.id, eventUpdate.parentId ? eventUpdate.parentId : 0,
        eventUpdate.sportId, eventUpdate.team1Id, eventUpdate.team2Id,
        eventUpdate.team1, eventUpdate.team2, eventUpdate.name,
        eventUpdate.namePrefix
      );
    });

  }

  makeOdds(customFactor) {

    if (!this.events.hasOwnProperty(customFactor.e))
      throw Error(`The event #${customFactor.e} doesn't exist`);

    const event = this.events[customFactor.e];
    const mainEvent = this.getTopEvent(event);
    event.team1Id = mainEvent.team1Id;
    event.team2Id = mainEvent.team2Id;
    event.team1 = mainEvent.team1;
    event.team2 = mainEvent.team2;

    const sport = this.sports[event.sportId];
    const mainSport = this.getTopSport(sport);
    sport.mainSportName = mainSport.name;

    if (!this.subscribedSports.hasOwnProperty( mainSport.id )) return null;

    customFactor.info = this.factorsCatalog[customFactor.f];

    return fonbetSports[sport.mainSportName].makeOdds(sport, event, customFactor);

  }

  subscribeToSports(sports = []) {
    sports.forEach( sport => {
      this.subscribeToSport(sport);
    })
  }

  subscribeToSport(sport) {
    const sportId = fonbetSports[sport].id;
    if (!this.subscribedSports.hasOwnProperty(sportId))
      this.subscribedSports[sportId] = new FonbetSport(
        sportId, 0, "", "", sport
      )
  }

  unsubscribeFromSports(sports = []) {
    sports.forEach( sport => {
      this.unsubscribeFromSport(sport);
    })
  }

  unsubscribeFromSport(sport) {
    if (this.subscribedSports.hasOwnProperty( fonbetSports[sport].id ))
      delete this.subscribedSports[fonbetSports[sport].id];
  }

  getTopSport(sport) {
    let topSport = sport;

    while (topSport.parentId)
      topSport = this.sports[topSport.parentId];

    return topSport;
  }
  getTopEvent(event) {
    let topEvent = event;

    while (topEvent.parentId)
      topEvent = this.events[topEvent.parentId];

    return topEvent;
  }

  updateFactorsCatalog(factorsCatalogUpdate = {}) {
    this.factorsCatalog = {};

    const groups = factorsCatalogUpdate.groups;

    let mainGroup = {};

    groups.forEach( group => {
      group.tables.forEach( table => {
        const tableHeader = table.rows[0];
        const tableBody = table.rows.slice(1);

        let title = "";
        let subtitle = "";

        if (table.hasOwnProperty("name")) {
          title = table.name;

          tableBody.forEach( row => {

            row.forEach( (cell, i) => {
              this.factorsCatalog[cell.factorId] = {
                title: title,
                subtitle: subtitle,
                outcome: tableHeader[i].name
              }
            })

          })
        } else {
          title = tableHeader[0].name;

          tableBody.forEach( row => {

            row.forEach( (cell, i) => {
              if (i === 0)
                subtitle = cell.name ? cell.name : "";
              else
                this.factorsCatalog[cell.factorId] = {
                  title: title,
                  subtitle: subtitle,
                  outcome: tableHeader[i].name
                }
            })

          })
        }

      });

    });

  }
}

module.exports = FonbetOddsParsingService;

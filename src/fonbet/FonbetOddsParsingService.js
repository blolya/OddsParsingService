const Flowable = require('../utils/react').Flowable;
const Requester = require('../utils/requester').Requester;

const {FonbetSport, FonbetEvent, fonbetSportsDict, api, FonbetStatus, fonbetFactorsDict, fonbetSports} = require('./fonbet');
const {Factor, ScopeType, SportEvent, OddsEnums} = require("../odds");

class FonbetOddsParsingService extends Flowable {
  constructor() {
    super();

    this.factorsCatalog = {};
    this.factorsCatalogRequester = new Requester(api.factors, { gzip: true });
    this.factorsCatalogRequester.on("response", rawFactorsCatalog =>
      this.updateFactorsCatalog( JSON.parse(rawFactorsCatalog) ));

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
      if (odds) this.emit("odds", JSON.stringify(odds));
    })

  }

  updateSports(sportsUpdates = {}) {

    // Set status flag OUTDATED to every sport except subscribed ones (there are a lot of subsports with unique IDs)
    for (let sportId in this.sports)
      if (this.sports[sportId].status !== FonbetStatus.MAIN)
        this.sports[sportId].status = FonbetStatus.OUTDATED;

    sportsUpdates.forEach( sportUpdate => {
      // Add a new Sport if it doesn't already exist and has its parent
      if (!this.sports.hasOwnProperty(sportUpdate.id))
        this.sports[sportUpdate.id] = new FonbetSport(
          sportUpdate.id, sportUpdate.parentId ? sportUpdate.parentId : 0,
          sportUpdate.kind, sportUpdate.regionId, sportUpdate.name, FonbetStatus.LIVE
        );
      else if (this.sports[sportUpdate.id].status !== FonbetStatus.MAIN)
        this.sports[sportUpdate.id].status = FonbetStatus.LIVE;
    });

    // Delete OUTDATED sports
    for (let sportId in this.sports)
      if(this.sports[sportId].status === FonbetStatus.OUTDATED) delete this.sports[sportId];

  }

  updateEvents(eventsUpdates = {}) {

    // Set FonbetStatus of pre-updated events to OUTDATED
    for (let eventId in this.events)
      this.events[eventId].status = FonbetStatus.OUTDATED;

    eventsUpdates.forEach( eventUpdate => {

      if (!this.events.hasOwnProperty(eventUpdate.id))
        this.events[eventUpdate.id] = new FonbetEvent(
          eventUpdate.id, eventUpdate.parentId ? eventUpdate.parentId : 0,
          eventUpdate.sportId, eventUpdate.team1Id, eventUpdate.team2Id,
          eventUpdate.team1, eventUpdate.team2, eventUpdate.name,
          eventUpdate.namePrefix, FonbetStatus.LIVE
        );
      else
        this.events[eventUpdate.id].status = FonbetStatus.LIVE;
    });

    // Remove outdated events
    for (let eventId in this.events)
      if (this.events[eventId].status === FonbetStatus.OUTDATED) delete this.events[eventId];

    this.clearUnsubscribedSportsAndEvents();
  }

  clearUnsubscribedSportsAndEvents() {
    for (let eventId in this.events) {
      const sport = this.sports[this.events[eventId].sportId];
      const topSport = this.getTopSport(sport);

      if (topSport.status !== FonbetStatus.MAIN)
        this.events[eventId].status = FonbetStatus.OUTDATED;
    }

    for (let sportId in this.sports) {
      const topSport = this.getTopSport(this.sports[sportId]);

      if (topSport.status !== FonbetStatus.MAIN)
        this.sports[sportId].status = FonbetStatus.OUTDATED;
    }

    for (let eventId in this.events)
      if (this.events[eventId].status === FonbetStatus.OUTDATED) delete this.events[eventId];

    for (let sportId in this.sports)
      if(this.sports[sportId].status === FonbetStatus.OUTDATED) delete this.sports[sportId];

  }

  makeOdds(customFactor) {

    if (!this.events.hasOwnProperty(customFactor.e))
      return null;

    const event = this.events[customFactor.e];

    if (!this.sports.hasOwnProperty(event.sportId))
      throw Error(`Sport #${event.sportId} doesn't exist.`);

    let mainEvent = this.getTopEvent(event);

    if (!this.sports.hasOwnProperty(event.sportId))
      throw Error(`Sport ${event.sportId} doesn't exist.`);

    const sport = this.sports[event.sportId];

    let mainSport = this.getTopSport(sport);

    const sportEvent = new SportEvent(
      OddsEnums.Sport[mainSport.name],
      sport.name.substring(sport.name.indexOf(".") + 2),
      mainEvent.team1,
      mainEvent.team2
    );

    console.log(customFactor);
    console.log(this.factorsCatalog[customFactor.f]);

  }

  subscribeToSports(sports = []) {
    sports.forEach( sport => {
      this.subscribeToSport(sport);
    })
  }

  subscribeToSport(sport) {
    const sportId = fonbetSports[sport].id;
    this.sports[sportId] = new FonbetSport(
      sportId, 0, "", "", sport, FonbetStatus.MAIN
    )
  }

  unsubscribeFromSports(sports = []) {
    sports.forEach( sport => {
      this.unsubscribeFromSport(sport);
    })
  }

  unsubscribeFromSport(sport) {
    if (this.sports[fonbetSports[sport].id].status === FonbetStatus.MAIN)
      delete this.sports[fonbetSports[sport].id];
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

        // let title = tableHeader[0].name;
        // let subtitle = "";
        //
        // tableBody.forEach( row => {
        //
        //   row.forEach( (cell, i) => {
        //     if (i === 0)
        //       subtitle = cell.name ? cell.name : "";
        //     else
        //       this.factorsCatalog[cell.factorId] = {
        //         title: title,
        //         subtitle: subtitle,
        //         outcome: tableHeader[i].name
        //       }
        //   })
        //
        // })

      });

    });

  }
}

module.exports = FonbetOddsParsingService;

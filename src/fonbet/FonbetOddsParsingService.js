const Flowable = require('../utils/react').Flowable;
const Requester = require('../utils/requester').Requester;

const {FonbetSport, FonbetEvent, fonbetSportsDict, api, FonbetStatus, fonbetFactorsDict, fonbetSports} = require('./fonbet');
const {Factor, SportEvent, OddsEnums} = require("../odds");

class FonbetOddsParsingService extends Flowable {
  constructor() {
    super();

    this.listenToUpdates(api.sport);

    this.sports = {};
    this.events = {};
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

  listenToUpdates(updatesAddress = "") {
    // Unscubscribe from previous Requester if it exists and create new
    if(this.updatesRequester) this.updatesRequester.unsubscribe();
    this.updatesRequester = new Requester(updatesAddress, { gzip: true });

    this.updatesRequester.on("response", rawUpdate => this.handleUpdate( JSON.parse(rawUpdate) ))

  }

  handleUpdate(update = "") {
    this.updateSports(update.sports);
    this.updateEvents(update.events);

    update.customFactors.forEach( customFactor => {

      const odds = this.makeOdds(customFactor);

      if (odds) this.emit("odds", JSON.stringify(odds));

    })
  }

  stopListeningToUpdates() {
    this.updatesRequester.unsubscribe();
  }

  makeOdds(customFactor) {

    if (!this.events.hasOwnProperty(customFactor.e))
      throw Error(`Event ${customFactor.e} doesn't exist.`);

    const event = this.events[customFactor.e];

    if (!this.sports.hasOwnProperty(event.sportId))
      return null;

    let mainEvent = event;
    if (event.parentId)
      mainEvent = this.events[event.parentId];
    while (mainEvent.parentId)
      mainEvent = this.events[mainEvent.parentId];

    if (!this.sports.hasOwnProperty(event.sportId))
      throw Error(`Sport ${event.sportId} doesn't exist.`);

    const sport = this.sports[event.sportId];

    let mainSport = sport;
    if (sport.parentId)
      mainSport = this.sports[sport.parentId];
    while(mainSport.parentId)
      mainSport =  this.sports[sport.parentId];

    const sportEvent = new SportEvent(
      OddsEnums.Sport[mainSport.name],
      sport.name.substring(sport.name.indexOf(".") + 2),
      mainEvent.team1,
      mainEvent.team2
    );

    console.log(sportEvent);


    // if (!this.sports.hasOwnProperty(event.sportId))
    //   return null;
    // else {
    //   const sport = this.sports[event.sportId];
    //
    //   const sportName = sport.parentId ? this.sports[sport.parentId].name : sport.name;
    //   const league = sport.parentId ? sport.name.substring(sport.name.indexOf(".") + 2) : "";
    //   const firstName = event.parentId ? this.events[event.parentId].team1 : event.team1;
    //   const secondName = event.parentId ? this.events[event.parentId].team2 : event.team2;
    //
    //   const sportEvent = new SportEvent(sportName, league, firstName, secondName);
    //
    //   if (fonbetFactorsDict.hasOwnProperty(customFactor.f)) {
    //     const scope = fonbetFactorsDict[customFactor.f].scope;
    //     const betType = fonbetFactorsDict[customFactor.f].bet;
    //
    //     switch (betType.type) {
    //       case OddsEnums.BetType.TOTAL:
    //         betType.total = customFactor.pt;
    //         break;
    //       case OddsEnums.BetType.HANDICAP:
    //         betType.handicap = customFactor.pt;
    //     }
    //
    //     return new Factor(sportEvent, scope, betType, OddsEnums.Bookmaker.FONBET, customFactor.v, 0, "qwe", !customFactor.isLive);
    //   } else {
    //     return null;
    //   }
    // }
  }

  updateSports(sportsUpdates = {}) {

    // Set status flag OUTDATED to every sport except subscribed ones (there are a lot of subsports with unique IDs)
    for (let sportId in this.sports)
      if (this.sports[sportId].status !== FonbetStatus.MAIN)
        this.sports[sportId].status = FonbetStatus.OUTDATED;

    sportsUpdates.forEach( sportUpdate => {
      // Add a new Sport if it doesn't already exist and has its parent
      if (!this.sports.hasOwnProperty(sportUpdate.id) && this.sports.hasOwnProperty(sportUpdate.parentId))
        this.sports[sportUpdate.id] = new FonbetSport(
          sportUpdate.id, sportUpdate.parentId,
          sportUpdate.kind, sportUpdate.regionId, sportUpdate.name, FonbetStatus.LIVE
        );

    });

    // Delete OUTDATED sports
    for (let sportId in this.sports)
      if(this.sports[sportId].status === FonbetStatus.OUTDATED) delete this.sports[sportId];

  }

  getMainSport(sport) {
    // if (!sport.parentId)
    //   return sport;

    let mainSport = sport;

    while (mainSport.parentId)
      mainSport = this.sports[mainSport.parentId];

    return mainSport;
  }
  getMainEvent(event) {
    let mainEvent = event;

    while (mainEvent.parentId)
      mainEvent = this.events[mainEvent.parentId];

    return mainEvent;
  }

  updateEvents(eventsUpdates = {}) {

    // Set FonbetStatus of pre-updated events to OUTDATED
    for (let eventId in this.events)
      this.events[eventId].status = FonbetStatus.OUTDATED;

    eventsUpdates.forEach( eventUpdate => {

      this.events[eventUpdate.id] = new FonbetEvent(
        eventUpdate.id, eventUpdate.parentId ? eventUpdate.parentId : 0, eventUpdate.sportId, eventUpdate.team1Id, eventUpdate.team2Id,
        eventUpdate.team1, eventUpdate.team2, eventUpdate.name, eventUpdate.namePrefix, FonbetStatus.LIVE
      );

    });

    // Remove outdated events
    for (let eventId in this.events)
      if (this.events[eventId].status === FonbetStatus.OUTDATED) delete this.events[eventId];

  }
}

module.exports = FonbetOddsParsingService;

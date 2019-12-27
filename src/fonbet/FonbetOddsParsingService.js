const Flowable = require('../utils/react').Flowable;
const Requester = require('../utils/requester').Requester;
const {Sport, Event, SportsDict, api, status} = require('./fonbet');
const factors = require("./fonbet").factors;
const odds = require('../odds');
const BetType = require("../odds").BetType;

class FonbetOddsParsingService extends Flowable {
  constructor() {
    super();

    this.sportApiAddress = api.sport;
    this.eventApiAddress = api.event;

    this.listenToUpdates(this.sportApiAddress);

    this.subscribedSports = {};

    this.sports = {};
    this.events = {};
  }

  subscribeToSports(sports = []) {
    sports.forEach( sport => {
      this.subscribeToSport(sport);
    })
  }

  subscribeToSport(sport) {
    this.subscribedSports[sport] = sport;
    this.sports[sport] = new Sport(
      sport, 0, "", "", SportsDict[sport], status.LIVE
    )
  }

  unsubscribeFromSports(sports = []) {
    sports.forEach( sport => {
      this.unsubscribeFromSport(sport);
    })
  }

  unsubscribeFromSport(sport) {
    delete this.sports[sport];
  }

  listenToUpdates(updatesAddress = "") {
    if(this.updatesRequester) this.updatesRequester.unsubscribe();
    this.updatesRequester = new Requester(this.sportApiAddress, { gzip: true });

    this.updatesRequester.on("response", (rawUpdate) => {
      const update = JSON.parse(rawUpdate);

      this.updateSports(update.sports);
      this.updateEvents(update.events);

      update.customFactors.forEach( customFactor => {

        if (customFactor.isLive) {
          const odds = this.makeOdds(customFactor);

          if (odds) {
            if (odds.event.sport === "BASKETBALL")
              this.emit("odds", JSON.stringify(odds));
          }
        }

      })
    })
  }
  stopListeningToUpdates() {
    this.updatesRequester.unsubscribe();
  }

  makeOdds(customFactor) {

    const event = this.events[customFactor.e];
    const sport = this.sports[event.sportId];

    const sportName = sport.parentId ? this.sports[sport.parentId].name : sport.name;
    const league = sport.parentId ? sport.name.substring(sport.name.indexOf(".") + 1) : "";
    const firstName = event.parentId ? this.events[event.parentId].team1 : event.team1;
    const secondName = event.parentId ? this.events[event.parentId].team2 : event.team2;

    const sportEvent = new odds.SportEvent(sportName, league, firstName, secondName);

    if (factors.hasOwnProperty(customFactor.f)) {
      const scope = factors[customFactor.f].scope;
      const betType = factors[customFactor.f].bet;

      switch (betType.type) {
        case BetType.TOTAL:
          betType.total = customFactor.pt;
          break;
        case BetType.HANDICAP:
          betType.handicap = customFactor.pt;
      }

      return new odds.Factor(sportEvent, scope, betType, "FONBET", customFactor.v, 0, "qwe", false);
    } else {
      return null;
    }
  }

  updateSports(sportsUpdates = {}) {
    for (let sportId in this.sports)
      if (!this.subscribedSports.hasOwnProperty(sportId))
        this.sports[sportId].status = status.OUTDATED;

    sportsUpdates.forEach( sportUpdate => {

      if (!this.subscribedSports.hasOwnProperty(sportUpdate.id))
        this.sports[sportUpdate.id] = new Sport(
          sportUpdate.id, sportUpdate.parentId ? sportUpdate.parentId : 0, sportUpdate.kind, sportUpdate.regionId, sportUpdate.name, status.LIVE
        );

    });

    for (let sportId in this.sports)
      if(this.sports[sportId].status === status.OUTDATED) delete this.sports[sportId];
  }

  updateEvents(eventsUpdates = {}) {

    // Set status of pre-updated events to OUTDATED
    for (let eventId in this.events)
      this.events[eventId].status = status.OUTDATED;

    eventsUpdates.forEach( eventUpdate => {

      this.events[eventUpdate.id] = new Event(
        eventUpdate.id, eventUpdate.parentId ? eventUpdate.parentId : 0, eventUpdate.sportId, eventUpdate.team1Id, eventUpdate.team2Id,
        eventUpdate.team1, eventUpdate.team2, eventUpdate.name, eventUpdate.namePrefix, status.LIVE
      );

    });

    // Remove pre-updated events
    for (let eventId in this.events)
      if (this.events[eventId].status === status.OUTDATED) delete this.events[eventId];

  }
}

module.exports = FonbetOddsParsingService;

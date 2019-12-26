const Flowable = require('../utils/react').Flowable;
const Requester = require('../utils/requester').Requester;
const {Sport, Event, SportsDict, api, status} = require('./fonbet');
const odds = require('../odds');

class FonbetOddsParsingService extends Flowable {
  constructor() {
    super();

    this.sportApiAddress = api.sport;
    this.eventApiAddress = api.event;

    this.listenToUpdates(this.sportApiAddress);

    this.sports = {};
    this.childSports = {};

    this.events = {};
    this.childEvents = {};
  }

  subscribeToSports(sports = []) {
    sports.forEach( sport => {
      this.subscribeToSport(sport);
    })
  }

  subscribeToSport(sport) {
    this.sports[sport] = {};
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
          this.emit("odds", odds);
        }

      })
    })
  }
  stopListeningToUpdates() {
    this.updatesRequester.unsubscribe();
  }

  makeOdds(customFactor) {
    if (this.events.hasOwnProperty(customFactor.e)) {

    } else {

    }

    const sportEvent = new odds.SportEvent(
      this.sports[this.events[customFactor.e].parentId]
    );

    return customFactor;
  }

  updateSports(sportsUpdates = {}) {
    for (let sportId in this.childSports)
      this.childSports[sportId].status = status.OUTDATED;

    sportsUpdates.forEach( sportUpdate => {

      if (!sportUpdate.parentId) {

        this.sports[sportUpdate.id] = new Sport(
          sportUpdate.id, 0, sportUpdate.kind, sportUpdate.regionId, sportUpdate.name, status.LIVE
        )

      } else {

        this.childSports[sportUpdate.id] = new Sport(
          sportUpdate.id, sportUpdate.parentId, sportUpdate.kind, sportUpdate.regionId, sportUpdate.name, status.LIVE
        )

      }

    });

    for (let sportId in this.childSports)
      if(this.childSports[sportId].status === status.OUTDATED) delete this.childSports[sportId];
  }

  updateEvents(eventsUpdates = {}) {

    // Set status of pre-updated events to OUTDATED
    for (let eventId in this.events)
      this.events[eventId].status = status.OUTDATED;
    for (let eventId in this.childEvents)
      this.childEvents[eventId].status = status.OUTDATED;

    eventsUpdates.forEach( eventUpdate => {

      if (!eventUpdate.parentId) {

        this.events[eventUpdate.id] = new Event(
          eventUpdate.id, 0, eventUpdate.sportId, eventUpdate.team1Id, eventUpdate.team2Id,
          eventUpdate.team1, eventUpdate.team2, eventUpdate.name, eventUpdate.namePrefix, status.LIVE
        );

      } else {

        this.childEvents[eventUpdate.id] = new Event(
          eventUpdate.id, eventUpdate.parentId, eventUpdate.sportId, eventUpdate.team1Id, eventUpdate.team2Id,
          eventUpdate.team1, eventUpdate.team2, eventUpdate.name, eventUpdate.namePrefix, status.LIVE
        );

      }

    });

    // Remove pre-updated events
    for (let eventId in this.events)
      if (this.events[eventId].status === status.OUTDATED) delete this.events[eventId];
    for (let eventId in this.childEvents) {
      if (this.childEvents[eventId].status === status.OUTDATED) delete this.childEvents[eventId];
    }

  }
}

module.exports = FonbetOddsParsingService;

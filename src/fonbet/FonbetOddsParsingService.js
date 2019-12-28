const Flowable = require('../utils/react').Flowable;
const Requester = require('../utils/requester').Requester;

const {FonbetSport, FonbetEvent, fonbetSportsDict, api, FonbetStatus, fonbetFactorsDict, fonbetSportsIds} = require('./fonbet');
const {Factor, SportEvent, OddsEnums} = require("../odds");

class FonbetOddsParsingService extends Flowable {
  constructor() {
    super();

    this.listenToUpdates(api.sport);

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
    const sportId = fonbetSportsIds[sport];

    this.subscribedSports[sportId] = sportId;
    this.sports[sportId] = new FonbetSport(
      sport, 0, "", "", fonbetSportsDict[sportId], FonbetStatus.LIVE
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
    this.updatesRequester = new Requester(updatesAddress, { gzip: true });

    this.updatesRequester.on("response", (rawUpdate) => {
      const update = JSON.parse(rawUpdate);

      this.updateSports(update.sports);
      this.updateEvents(update.events);

      update.customFactors.forEach( customFactor => {

        if (customFactor.isLive) {
          const odds = this.makeOdds(customFactor);

          if (odds) {
            if (odds.event.sport === OddsEnums.Sport.BASKETBALL)
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

    const sportEvent = new SportEvent(sportName, league, firstName, secondName);

    if (fonbetFactorsDict.hasOwnProperty(customFactor.f)) {
      const scope = fonbetFactorsDict[customFactor.f].scope;
      const betType = fonbetFactorsDict[customFactor.f].bet;

      switch (betType.type) {
        case OddsEnums.BetType.TOTAL:
          betType.total = customFactor.pt;
          break;
        case OddsEnums.BetType.HANDICAP:
          betType.handicap = customFactor.pt;
      }

      return new Factor(sportEvent, scope, betType, OddsEnums.Bookmaker.FONBET, customFactor.v, 0, "qwe", false);
    } else {
      return null;
    }
  }

  updateSports(sportsUpdates = {}) {
    for (let sportId in this.sports)
      if (!this.subscribedSports.hasOwnProperty(sportId))
        this.sports[sportId].status = FonbetStatus.OUTDATED;

    sportsUpdates.forEach( sportUpdate => {

      if (!this.subscribedSports.hasOwnProperty(sportUpdate.id))
        this.sports[sportUpdate.id] = new FonbetSport(
          sportUpdate.id, sportUpdate.parentId ? sportUpdate.parentId : 0, sportUpdate.kind, sportUpdate.regionId, sportUpdate.name, FonbetStatus.LIVE
        );

    });

    for (let sportId in this.sports)
      if(this.sports[sportId].status === FonbetStatus.OUTDATED) delete this.sports[sportId];
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

    // Remove pre-updated events
    for (let eventId in this.events)
      if (this.events[eventId].status === FonbetStatus.OUTDATED) delete this.events[eventId];

  }
}

module.exports = FonbetOddsParsingService;

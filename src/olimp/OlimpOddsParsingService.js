const Flowable = require('../utils/react').Flowable;
const RequestSubscriber = require('../utils/subscriber').RequestSubscriber;
const api = require('./olimp').api;

class OlimpOddsParsingService extends Flowable {
  constructor(props) {
    super(props);

    this.sportApiAddress = api.sport;
    this.eventApiAddress = api.event;

    this.sportsRequester = new RequestSubscriber();
    this.sportsRequester.on('response', (rawSportResponse) => {
      const eventsIdsList = this.parseSport(rawSportResponse);
      this.subscribeToEvents(eventsIdsList);
    });

    this.eventsRequester = new RequestSubscriber();
    this.eventsRequester.on('response', (rawResponse) => {
      this.emit('newOdds', rawResponse);
    });
  }

  subscribeToEvent(eventId, timeout) {
    this.eventsRequester.subscribe(`${this.eventApiAddress}?id=${eventId}`, timeout);
  }
  unsubscribeFromEvent(eventId) {
    this.eventsRequester.unsubscribe(`${this.eventApiAddress}?id=${eventId}`);
  }
  subscribeToEvents(eventsIds = [], timeout) {
    eventsIds.forEach((eventId) => {
      this.subscribeToEvent(eventId, timeout);
    })
  }

  subscribeToSport(sport, timeout) {
    console.log(`${this.sportApiAddress}?=${sport}`);
    this.sportsRequester.subscribe(`${this.sportApiAddress}?id=${sport}`, timeout);
  }
  unsubscribeFromSport(sport, timeout) {
    this.sportsRequester.unsubscribe(`${this.sportApiAddress}?id=${sport}`);
  }
  subscribeToSports(sports = [], timeout) {
    sports.forEach((sport) => {
      this.subscribeToSport(sport, timeout);
    })
  }

  parseSport(rawSportResponse) {
    const eventsIdsList = [];
    const sport = JSON.parse(rawSportResponse);
    sport.events.forEach((event) => {
      eventsIdsList.push(event.id);
    });
    return eventsIdsList;
  }
}

module.exports = OlimpOddsParsingService;

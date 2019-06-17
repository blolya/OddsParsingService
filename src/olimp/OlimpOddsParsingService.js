const Flowable = require('../utils/react').Flowable;
const RequestSubscriber = require('../utils/subscriber').RequestSubscriber;
const api = require('./olimp').api;

class OlimpOddsParsingService extends Flowable {
  constructor(props) {
    super(props);

    this.sportApiAddress = api.sport;
    this.eventApiAddress = api.event;

    this.sportsEvents = {};
    this.events = [];

    this.sportsRequester = new RequestSubscriber();
    this.sportsRequester.on('response', (rawSportResponse) => {
      const {sportId, eventsIdsList} = this.parseSport(rawSportResponse);
      this.sportsEvents[sportId] = eventsIdsList;
      this.subscribeToEvents(eventsIdsList);
    });

    this.eventsRequester = new RequestSubscriber();
    this.eventsRequester.on('response', (rawResponse) => {
      this.emit('newOdds', rawResponse);
    });
  }

  subscribeToEvent(eventId, timeout) {
    if (!this.events.includes(eventId)) {
      this.eventsRequester.subscribe(`${this.eventApiAddress}?id=${eventId}`, timeout);
      this.events.push(eventId);
    }
  }
  unsubscribeFromEvent(eventId) {
    this.eventsRequester.unsubscribe(`${this.eventApiAddress}?id=${eventId}`);
  }
  subscribeToEvents(eventsIds = [], timeout) {
    eventsIds.forEach((eventId) => {
      this.subscribeToEvent(eventId, timeout);
    })
  }
  unsubscribeFromEvents(eventsIds = []) {
    eventsIds.forEach((eventId) => {
      this.unsubscribeFromEvent(eventId);
    })
  }

  subscribeToSport(sport, timeout) {
    this.sportsRequester.subscribe(`${this.sportApiAddress}?id=${sport}`, timeout);
  }
  unsubscribeFromSport(sport) {
    this.sportsEvents[sport].forEach((eventId) => {
      this.unsubscribeFromEvent(eventId);
    });
    this.sportsRequester.unsubscribe(`${this.sportApiAddress}?id=${sport}`);
  }
  subscribeToSports(sports = [], timeout) {
    sports.forEach((sport) => {
      this.subscribeToSport(sport, timeout);
    })
  }
  unsubscribeFromSports(sports = []) {
    sports.forEach((sport) => {
      this.unsubscribeFromSport(sport);
    })
  }

  parseSport(sportResponse) {
    const eventsIdsList = [];
    const sport = JSON.parse(sportResponse);
    sport.events.forEach((event) => {
      eventsIdsList.push(event.id);
    });

    return {
      sportId: sport.sport.id,
      eventsIdsList: eventsIdsList
    }
  }
}

module.exports = OlimpOddsParsingService;

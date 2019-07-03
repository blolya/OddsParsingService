const Flowable = require('../utils/react').Flowable;
const Requester = require('../utils/requester').Requester;
const {Sport, Event, api} = require('./olimp');

class OlimpOddsParsingService extends Flowable {
  constructor(props) {
    super(props);

    this.sportApiAddress = api.sport;
    this.eventApiAddress = api.event;

    this.sports = {};

    this.sportsRequester = new Requester();
    this.eventsRequester = new Requester();
  }

  subscribeToEvent(eventId, timeout, sportId = 0) {
    this.eventsRequester.subscribe(`${this.eventApiAddress}?id=${eventId}`, timeout);
    this.eventsRequester.on('response', (rawEventResponse) => {
      const parsedEventResponse = JSON.parse(rawEventResponse);
      this.sports[sportId].events[parsedEventResponse.id] = new Event(parsedEventResponse.id, sportId);
      this.emit('newOdds', rawEventResponse);
    });
  }
  unsubscribeFromEvent(eventId, sportId = 0) {
    delete this.sports[sportId].events[eventId];
    this.eventsRequester.unsubscribe(`${this.eventApiAddress}?id=${eventId}`);
  }
  subscribeToEvents(eventsIds = [], timeout, sportId) {
    eventsIds.forEach((eventId) => {
      this.subscribeToEvent(eventId, timeout, sportId);
    })
  }

  subscribeToSport(sportId, timeout) {
    this.sportsRequester.subscribe(`${this.sportApiAddress}?id=${sportId}`, timeout);
    this.sportsRequester.on('response', (rawSportResponse) => {

      const eventsIdsList = this.parseSport(rawSportResponse);
      this.sports[sportId] = new Sport(sportId);
      this.subscribeToEvents(eventsIdsList, timeout, sportId);
    });
  }
  unsubscribeFromSport(sportId, timeout) {
    for (let eventId in this.sports[sportId].events) this.unsubscribeFromEvent(eventId, sportId);
    delete this.sports[sportId];
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

const Flowable = require('../utils/react').Flowable;
const Requester = require('../utils/requester').Requester;
const {Sport, Event, api, sportTypes} = require('./olimp');

class OlimpOddsParsingService extends Flowable {
  constructor(props) {
    super(props);

    this.sportApiAddress = api.sport;
    this.eventApiAddress = api.event;


    this.sportsEvents = {};
  }

  subscribeToEvent(sport = sportTypes.ANY, eventId, timeout) {
    if (!this.sportsEvents[sport].events[eventId]) {

      this.sportsEvents[sport].events[eventId] = new Event(eventId);
      this.sportsEvents[sport].events[eventId].subscribe(timeout);

      this.sportsEvents[sport].events[eventId].connection.on('response', (rawEventResponse) => {
        const parsedEventResponse = JSON.parse(rawEventResponse);
        if (parsedEventResponse.error == 'NOT_FOUND')
          this.sportsEvents[sport].events[eventId].unsubscribe();
        else
          this.emit('newOdds', rawEventResponse);
      })

    }
  }
  unsubscribeFromEvent(sport = sportTypes.ANY, eventId) {
    this.sportsEvents[sport].events[eventId].unsubscribe();
    this.sportsEvents[sport].events[eventId] = undefined;
  }
  subscribeToEvents(sport = sportTypes.ANY, eventsIds = [], timeout) {
    eventsIds.forEach((eventId) => {
      this.subscribeToEvent(sport, eventId, timeout);
    });
  }
  unsubscribeFromEvents(sport = sportTypes.ANY, eventsIds = []) {
    eventsIds.forEach((eventId) => {
      this.unsubscribeFromEvent(sport, eventId);
    })
  }

  subscribeToSport(sport = sportTypes.ANY, timeout) {
    this.sportsEvents[sport] = new Sport(sport);
    this.sportsEvents[sport].subscribe(timeout);
    this.sportsEvents[sport].connection.on('response', (rawSportResponse) => {
      const eventsIdsList = this.parseSport(rawSportResponse);
      this.subscribeToEvents(sport, eventsIdsList, timeout);
    })
  }
  unsubscribeFromSport(sport = sportTypes.ANY) {
    for (let eventId in this.sportsEvents[sport].events) {
      this.unsubscribeFromEvent(sport, eventId);
    }
    this.sportsEvents[sport].unsubscribe();
    this.sportsEvents[sport] = undefined;
  }
  subscribeToSports(sports = [sportTypes.ANY], timeout) {
    sports.forEach((sport) => {
      this.subscribeToSport(sport, timeout);
    })
  }
  unsubscribeFromSports(sports = [sportTypes.ANY]) {
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

    return eventsIdsList;
  }
}

module.exports = OlimpOddsParsingService;

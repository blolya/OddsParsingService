const OddsParsingService = require('../general/OddsParsingService');
const RequestSubscriber = require('../utils/subscriber').RequestSubscriber;
const api = require('./olimp').api;

class OlimpOddsParsingService extends OddsParsingService {
  constructor(props) {
    super(props);
    this.sportApiAddress = api.sport;
    this.eventApiAddress = api.event;
  }

  createSubscription(address, timeout) {
    return new RequestSubscriber(address, timeout);
  }

  parseSport(rawSportResponse) {
    const eventsIdsList = [];
    const sport = JSON.parse(rawSportResponse);
    sport.events.forEach((event) => {
      eventsIdsList.push(event.id);
    });
    return eventsIdsList;
  }

  createEventApiAddress(eventId = 0) {
    return `${this.eventApiAddress}?id=${eventId}`;
  }
  createSportApiAddress(sportId = 0) {
    return `${this.sportApiAddress}?id=${sportId}`;
  }
}

module.exports = OlimpOddsParsingService;

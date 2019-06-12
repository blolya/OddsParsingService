const OddsParsingService = require('./OddsParsingService');

class OlimpOddsParsingService extends OddsParsingService{
  constructor() {
    super();
  }

  parseEventsIds(sportPageRawResponse = '') {
    const eventsIdsList = [];

    const sportPageParsedResponse = JSON.parse(sportPageRawResponse);
    sportPageParsedResponse.events.forEach((event) => {
      eventsIdsList.push(event.id);
    });

    return eventsIdsList;
  }
  parseOdds(eventPageRawResponse = '') {

    const event = JSON.parse(eventPageRawResponse);
    event.markets.forEach((market) => {
      this.oddsFlow.emit('newOdds', {
        "firstTeam": event.name.split(' - ')[0],
        "secondTeam": event.name.split(' - ')[1],
        "sport": event.sportName,
        "scope": {
          "type": "set",
          "params": {
            "number": 1
          }
        },
        "kind": {
          "type": "mainline",
          "params": {
            "outcome": "1"
          }
        },
        "bookmaker": "olimp",
        "value": market.value,
        "updated": new Date().toJSON(),
        "extra": {
          "eventId": 72389,
          "sportId": 12
        }
      } );

    });
  }
}

module.exports = OlimpOddsParsingService;

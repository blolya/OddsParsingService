const OddsParsingService = require('./OddsParsingService');

class OlimpOddsParsingService extends OddsParsingService{
  constructor() {
    super();
    this.sportApiAddress = 'https://api.ruolimp.ru/api/live/sport';
    this.eventApiAddress = 'https://api.ruolimp.ru/api/live/event';
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
    const oddsList = [];

    const event = JSON.parse(eventPageRawResponse);
    event.markets.forEach((market) => {
      oddsList.push({
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
          "type": market.name,
          "params": {
            "outcome": market.outcomeType
          }
        },
        "bookmaker": "olimp",
        "value": +market.value,
        "updated": new Date().toJSON(),
        "extra": {
          "eventId": event.id,
          "sportId": event.sportId
        }
      })
    });

    return oddsList;
  }
}

module.exports = OlimpOddsParsingService;

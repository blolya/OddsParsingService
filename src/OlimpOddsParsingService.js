const OddsParsingService = require('./OddsParsingService');

class OlimpOddsParsingService extends OddsParsingService{
  constructor() {
    super();
  }

  parseEventsIds(sportPageRawResponse = '') {
    const sportPageParsedResponse = JSON.parse(sportPageRawResponse);

  }
}

module.exports = OlimpOddsParsingService;

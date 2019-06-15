'use strict';

const OddsParsingService = require('./OddsParsingService');


const main = async () => {
  const OlimpOddsParsingService = new OddsParsingService();
  OlimpOddsParsingService.subscribeToSports([3]);
  OlimpOddsParsingService.on('newOdds', (odds) => {
    console.log(odds);
  })
};

main();

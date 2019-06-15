'use strict';

const OlimpOddsParsingService = require('./olimp/OlimpOddsParsingService');
const sports = require('./olimp/olimp').sports;


const main = async () => {
  const oops = new OlimpOddsParsingService();
  oops.subscribeToSports([sports.TENNIS]);
  oops.on('newOdds', (odds) => {
    console.log(odds);
  })
};

main();

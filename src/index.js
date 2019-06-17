'use strict';

const OlimpOddsParsingService = require('./olimp/OlimpOddsParsingService');
const sports = require('./olimp/olimp').sports;
const RequestSubscriber = require('./utils/subscriber').RequestSubscriber;


const main = async () => {
  const oops = new OlimpOddsParsingService();
  oops.subscribeToSport(3, 1000);
  oops.on('newOdds', (odds) => {
    console.log(odds);
  });
};

main();

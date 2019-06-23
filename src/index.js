'use strict';

const OlimpOddsParsingService = require('./olimp/OlimpOddsParsingService');
const sports = require('./olimp/olimp').sports;
const RequestSubscriber = require('./utils/subscriber').RequestSubscriber;


const main = async () => {
  const oops = new OlimpOddsParsingService();
  oops.subscribeToSports([3], 1000);
  oops.on('newOdds', (odds) => {
    console.log(odds);
  });
  setTimeout(() => {
    oops.unsubscribeFromSport(3);
  }, 6000);
};

main();

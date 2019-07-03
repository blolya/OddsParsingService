'use strict';

const OlimpOddsParsingService = require('./olimp/OlimpOddsParsingService');
const sports = require('./olimp/olimp').sportTypes;
const RequestSubscriber = require('./utils/subscriber').RequestSubscriber;


const main = async () => {
  const oops = new OlimpOddsParsingService();
  oops.subscribeToSports([sports.TENNIS, sports.FOOTBALL], 1000);
  oops.on('newOdds', (odds) => {
    console.log(odds);
  });
  setTimeout(() => {
    oops.unsubscribeFromSports([sports.TENNIS, sports.FOOTBALL]);
  }, 3000);
};

main();

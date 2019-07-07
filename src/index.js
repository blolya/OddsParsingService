'use strict';

const OlimpOddsParsingService = require('./olimp/OlimpOddsParsingService');
const sports = require('./olimp/olimp').sportTypes;
const RequestSubscriber = require('./utils/subscriber').RequestSubscriber;
const cloudscraper = require('cloudscraper');


const main = async () => {
  const oops = new OlimpOddsParsingService();
  oops.subscribeToSports([sports.TENNIS, sports.FOOTBALL], 1000);
  oops.on('newOdds', (odds) => {
    console.log(odds);
  });
  setTimeout(() => {
    oops.unsubscribeFromSport(sports.TENNIS);
  }, 16000);
};

main();

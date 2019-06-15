'use strict';

const OlimpOddsParsingService = require('./olimp/OlimpOddsParsingService');
const sports = require('./olimp/olimp').sports;
const RequestSubscriber = require('./utils/subscriber').RequestSubscriber;


const main = async () => {
  const oops = new RequestSubscriber('https://api.ruolimp.ru/api/live/event?id=49623430', 1000);
  oops.on('response', (odds) => {
    console.log(odds);
  })
  setTimeout(() => {
    oops.unsubscribe();
  }, 3000);
};

main();

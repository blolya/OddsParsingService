'use strict';

const FonbetOddsParsingService = require('./fonbet/FonbetOddsParsingService');
const {BASKETBALL} = require('./fonbet/fonbet').sports;
const request = require('request');

const main = async () => {
  const fops = new FonbetOddsParsingService();
  fops.subscribeToSports([BASKETBALL], 1000);
  fops.on("odds", (odds) => {
    console.log(odds);
  });

};

main();

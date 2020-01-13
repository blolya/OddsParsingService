'use strict';


const FonbetOddsParsingService = require('./fonbet/FonbetOddsParsingService');
const Sport = require("./odds").OddsEnums.Sport;

const main = async () => {
  const fops = new FonbetOddsParsingService();
  fops.subscribeToSports([Sport.BASKETBALL], 1000);
  fops.on("odds", (odds) => {
    console.log( JSON.stringify(odds));
  });

};

main();

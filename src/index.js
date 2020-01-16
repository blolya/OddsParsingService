'use strict';


const FonbetOddsParsingService = require('./fonbet/FonbetOddsParsingService');
const Sport = require("./odds").OddsEnums.Sport;

const main = async () => {
  const fops = new FonbetOddsParsingService();
  fops.subscribeToSports([Sport.TENNIS], 1000);
  fops.on("odds", (odds) => {
      if (odds.betType.type)
        console.log( JSON.stringify(odds) );
  });

};

main();

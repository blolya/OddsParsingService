'use strict';

const OlimpOddsParsingService = require('./OddsParsingService');

const main = async () => {
    const oops = new OlimpOddsParsingService();

    const oddsFlow = oops.subscribeToEvents([49499857]);
    oddsFlow.on('newOdds', (odds) => {
        console.log(`New odds has arrived ${odds}`);
    })
};

main();

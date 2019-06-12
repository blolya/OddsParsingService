'use strict';

const OlimpOddsParsingService = require('./OlimpOddsParsingService');

const main = async () => {
    const oops = new OlimpOddsParsingService();

    oops.subscribeToSports([3, 5]);
    oops.oddsFlow.on('newOdds', (odds) => {
        console.log(odds);
    })
};

main();

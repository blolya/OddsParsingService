'use strict';

const EventEmitter = require('events');
const react = require('./react');
const rq = require('./requester');

class OddsParsingService {
  constructor() {
  }

  subscribeToEvents(eventsIdsList = []) {
    const oddsFlow = new react.Flowable();

    eventsIdsList.forEach((eventId) => {
      const requester = new rq.Requester(`https://api.ruolimp.ru/api/live/event?id=${eventId}`, 2000);
      requester.on('response', (response) => {
        oddsFlow.emit('newOdds', response);
      })
    });
    return oddsFlow;
  }

  subscribeToSports(sportsIdsList = []) {
    let oddsFlow = new react.Flowable();

    sportsIdsList.forEach((sportId) => {
      const sportRequester = new rq.Requester(`https://api.ruolimp.ru/api/live/sport?id=${sportId}`);
      sportRequester.on('response', (response) => {
        const eventsIdsList = this.parseEventsIds(response);
        oddsFlow = this.subscribeToEvents(eventsIdsList);
      })
    });

    return oddsFlow;
  }

  parseEventsIds(sportPageRawResponse = '') {}
}

module.exports = OddsParsingService;

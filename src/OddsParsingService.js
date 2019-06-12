'use strict';

const EventEmitter = require('events');
const react = require('./react');
const rq = require('./requester');

class OddsParsingService {
  constructor() {
    this.sportsRequesters = new Map();
    this.liveEventsRequesters = new Map();
    this.oddsFlow = new react.Flowable();
  }

  subscribeToEvents(eventsIdsList = []) {
    eventsIdsList.forEach((eventId) => {
      const requester = new rq.Requester(`https://api.ruolimp.ru/api/live/event?id=${eventId}`, 2000);
      requester.on('response', async (response) => {
        const oddsList = this.parseOdds(response);
        // oddsList.forEach((odds) => {
        //   this.oddsFlow.emit('newOdds', odds);
        // })
      })
    });
  }

  subscribeToSports(sportsIdsList = []) {
    sportsIdsList.forEach((sportId) => {

      this.sportsRequesters[sportId] = new rq.Requester(`https://api.ruolimp.ru/api/live/sport?id=${sportId}`);
      this.sportsRequesters[sportId].on('response', (response) => {
        const liveEventsIdsList = this.parseEventsIds(response);
        this.subscribeToEvents(liveEventsIdsList);
      })
    });
  }

  parseEventsIds(sportPageRawResponse = '') {}
  async parseOdds(eventPageRowResponse = '') {}
}

module.exports = OddsParsingService;

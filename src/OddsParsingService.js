'use strict';

const EventEmitter = require('events');
const react = require('./react');
const rq = require('./requester');

class OddsParsingService {
  constructor() {
    this.sportsRequesters = new Map();
    this.liveEventsRequesters = new Map();
    this.oddsFlow = new react.Flowable();

    this.sportApiAddress = '';
    this.eventApiAddress = '';
  }

  subscribeToEvents(eventsIdsList = [], callback) {
    callback(this.oddsFlow);

    eventsIdsList.forEach((eventId) => {

      if (!this.liveEventsRequesters.has(eventId)) {
        this.liveEventsRequesters[eventId] = new rq.Requester(`${this.eventApiAddress}?id=${eventId}`, 2000);
        this.liveEventsRequesters[eventId].on('response', async (response) => {
          const oddsList = this.parseOdds(response);
          oddsList.forEach((odds) => {
            this.oddsFlow.emit('newOdds', odds);
          })
        })
      } else {
        console.log((`${eventId} is already in list`));
      }

    });
  }

  subscribeToSports(sportsIdsList = [], callback) {
    sportsIdsList.forEach((sportId) => {

      this.sportsRequesters[sportId] = new rq.Requester(`${this.sportApiAddress}?id=${sportId}`);
      this.sportsRequesters[sportId].on('response', (response) => {
        const liveEventsIdsList = this.parseEventsIds(response);
        this.subscribeToEvents(liveEventsIdsList, callback);
      })

    });
  }

  parseEventsIds(sportPageRawResponse = '') {}
  parseOdds(eventPageRowResponse = '') {}
}

module.exports = OddsParsingService;

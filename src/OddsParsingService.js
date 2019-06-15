'use strict';

const Flowable = require('./react').Flowable;
const RequestSubscriber = require('./subscriber').RequestSubscriber;

class OddsParsingService extends Flowable {
  constructor(props) {
    super(props);
    this.sportsSubscribers = new Map();
    this.liveEventsSubscribers = new Map();
  }


  subscribeToEvents(eventsIdsList = []) {
    eventsIdsList.forEach(async (eventId) => {
      if(!this.liveEventsSubscribers.has(eventId)) {
        this.liveEventsSubscribers[eventId] = new RequestSubscriber(`https://api.ruolimp.ru/api/live/event?id=${eventId}`, 2000);
        this.liveEventsSubscribers[eventId].on('response', (rawResponse) => {
          this.emit('newOdds', rawResponse);
        })
      }
    })
  }

  subscribeToSports(sportsIdsList = []) {
    sportsIdsList.forEach(async (sportId) => {
      this.sportsSubscribers[sportId] = new RequestSubscriber(`https://api.ruolimp.ru/api/live/sport?id=${sportId}`, 2000);
      this.sportsSubscribers[sportId].on('response', (rawResponse) => {
        const sportEvents = JSON.parse(rawResponse).events;
        const sportEventsIds = [];
        sportEvents.forEach((sportEvent) => sportEventsIds.push(sportEvent.id));
        this.subscribeToEvents(sportEventsIds);
      })
    })
  }

  parseEventsIds(sportPageRawResponse = '') {}
  parseOdds(eventPageRowResponse = '') {}
}

module.exports = OddsParsingService;

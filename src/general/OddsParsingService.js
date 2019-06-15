'use strict';

const Flowable = require('../utils/react').Flowable;
const RequestSubscriber = require('../utils/subscriber').RequestSubscriber;


class OddsParsingService extends Flowable {
  constructor(props) {
    super(props);
    this.sportsSubscribtions = new Map();
    this.liveEventsSubscriptions = new Map();
  }


  subscribeToEvent(eventId, timeout) {
    if(!this.liveEventsSubscriptions.has(eventId)) {
      this.liveEventsSubscriptions[eventId] = this.createSubscription(this.createEventApiAddress(eventId), timeout);
      this.liveEventsSubscriptions[eventId].on('response', async (rawData) => {
        this.emit('newOdds', rawData);
      })
    } else {
      console.log(`Event ${eventId} is already subscribed`);
    }
  }

  subscribeToSports(sportsList = [], timeout = 2000) {

    sportsList.forEach(async (sport) => {
      if(!this.sportsSubscribtions.has(sport)) {
        this.sportsSubscribtions[sport] = this.createSubscription(this.createSportApiAddress(sport), timeout);
        this.sportsSubscribtions[sport].on('response', async (response) => {
          const eventsIdsList = this.parseSport(response);
          eventsIdsList.forEach((eventId) => this.subscribeToEvent(eventId), timeout);
        })
      } else {
        console.log(`Sport ${sport} is already subscribed`);
      }

    });

  }

  createSubscription(address, timeout) {}

  parseEvent() {}
  parseSport() {}

  createEventApiAddress(eventId = 0) {}
  createSportApiAddress(sportId = 0) {}

}

module.exports = OddsParsingService;

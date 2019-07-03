const Requester = require('../utils/requester').Requester;

const sportTypes = {
  ANY: 0,
  FOOTBALL: 1,
  TENNIS: 3
};
const api = {
  event: 'https://api.ruolimp.ru/api/live/event',
  sport: 'https://api.ruolimp.ru/api/live/sport'
};

class Sport {
  constructor(id) {
    this.id = id;
    this.events = {};
  }
  subscribe(timeout) {
    this.connection = new Requester(`${api.sport}?id=${this.id}`, timeout);
  }
  unsubscribe() {
    this.connection.unsubscribe();
  }
}
class Event {
  constructor(id, sportId) {
    this.id = id;
    this.sportId = sportId;
  }
  subscribe(timeout) {
    this.connection = new Requester(`${api.event}?id=${this.id}`, timeout);
  }
  unsubscribe() {
    this.connection.unsubscribe();
  }
}

module.exports = {
  Sport,
  Event,
  sportTypes,
  api
};

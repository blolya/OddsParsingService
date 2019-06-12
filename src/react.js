const EventEmitter = require('events');

class Flowable extends EventEmitter {
  constructor() {
    super();
  }
}

module.exports = { Flowable };

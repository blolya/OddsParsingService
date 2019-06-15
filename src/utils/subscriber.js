const Flowable = require('./react').Flowable;
const Requester = require('./requester').Requester;
const WebSocket = require('ws');

class Subscriber extends Flowable {
  constructor(address, timeout) {
    super();
    this.subscribe(address, timeout);
  }

  subscribe(address, timeout) {
    this.connection = new Flowable();
    this.connection.on('response', (data) => {
      this.emit('response', data);
    })
  }
  unsubscribe() {
    this.connection.unsubscribe();
  }
}

class WebSocketSubscriber extends Subscriber {
  constructor(address, timeout) {
    super(address, timeout);
  }

  subscribe(address, timeout) {
    this.connection = WebSocket(new URL(address));
    this.connection.on('open', () => console.log(`Websocket connection to ${address} was established`));
    this.connection.on('message', (data) => {
      this.emit('response', data);
    })
  }
}

class RequestSubscriber extends Subscriber{
  constructor(address, timeout) {
    super(address, timeout);
  }

  subscribe(address, timeout) {
    this.connection = new Requester(address, timeout);
    this.connection.on('response', (data) => {
      this.emit('response', data);
    })
  }
}

module.exports = {
  Subscriber,
  WebSocketSubscriber,
  RequestSubscriber
};

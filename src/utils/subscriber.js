const Flowable = require('./react').Flowable;
const Requester = require('./requester').Requester;
const WebSocket = require('ws');
const crypto = require('crypto');

class WebSocketSubscriber extends Flowable {
  constructor(address, message) {
    super(address);

    this.connection = new WebSocket(new URL(address));

    this.connection.on('open', () => {
      this.connection.send(message);
      console.log(`Websocket connection to ${address} was established`)
    });
    this.connection.on('message', (data) => {
      this.emit('response', data);
    })
  }

  subscribe(message) {
    this.connection.send(message);
  }
  unsubscribe(message) {
    this.connection.send(message);
  }
}

class RequestSubscriber extends Flowable {
  constructor(props) {
    super(props);

    this.connections = new Map();
    this.salt = 'OMEGALUL';
  }

  subscribe(address, timeout) {
    const connectionKey = this.createHash(address);

    this.connections[connectionKey] = new Requester(address, timeout);
    this.connections[connectionKey].on('response', (data) => {
      this.emit('response', data);
    })
  }

  unsubscribe(address) {
    const connectionKey = this.createHash(address);
    this.connections[connectionKey].unsubscribe();
  }

  createHash(data) {
    return crypto.createHmac('sha256', this.salt)
      .update(data)
      .digest('hex');
  }
}

module.exports = {
  WebSocketSubscriber,
  RequestSubscriber
};

const http = require('http');
const https = require('https');
const Flowable = require("./react").Flowable;
const cloudscraper = require('cloudscraper');

class Requester extends Flowable {
  constructor(address = '', timeout = 1000) {
    super();

    this.interval = setInterval(async () => {
      this.emit('response', await cloudscraper.get(address));
    }, timeout);
  }
  unsubscribe() {
    clearInterval(this.interval);
  }
}

function fetch(address = "") {
  const url = new URL(address);
  const handlers = {
    'http:': http.get,
    'https:': https.get
  };

  return new Promise((resolve, reject) => {
    handlers[url.protocol](address, (res) => {
      let rawData = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        rawData += chunk;
      });
      res.on('end', () => {
        try {
          resolve(rawData);
        } catch (e) {
          reject(e);
        }
      })
    }).on('error', (e) => {
      reject(e);
    });
  });
}


module.exports = {
  fetch,
  Requester
};

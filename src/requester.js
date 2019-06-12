const http = require('http');
const https = require('https');
const react = require("./react");

class Requester extends react.Flowable {
  constructor(address = '', timeout = 1000) {
    super();

    setInterval(async () => {
      const response = await fetch(address);
      this.emit('response', response);
    }, timeout);
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

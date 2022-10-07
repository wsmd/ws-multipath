'use strict';

const http = require('http');
const https = require('https');
const { EventEmitter } = require('events');
const { parse: parseUrl } = require('url');
const { inherits } = require('util');
const { invariant, withoutProperties } = require('./utils');
const { createHandlerCreator } = require('./createHandlerCreator');
const { rejectSocket } = require('./rejectSocket');
const { delegateEmittedEvents } = require('./delegateEmittedEvents');

const HTTP_EVENTS_TO_EXPOSE = ['close'];
const PRIVATE_ATTRS = ['port', 'autoListen'];

const defaults = {
  autoListen: true,
  rejectUnhandled: true,
};

function MultipathServer(options) {
  invariant(
    typeof options !== 'undefined',
    'The "options" argument must of type Object'
  );

  invariant(
    typeof options.port === 'number',
    'The "options.port" option must be of type Number'
  );

  options = Object.assign({}, defaults, options);

  const handlers = {};
  var server;
  if (options.ca && options.cert && options.key)
    server = https.createServer({
	    ca: options.ca,
	    cert: options.cert,
	    key: options.key
    });
  else
    server = http.createServer();

  delegateEmittedEvents(HTTP_EVENTS_TO_EXPOSE, server, this);

  // Handle an HTTP upgrade request by delegating that request to the proper
  // websocket server if it exists
  server.on('upgrade', (request, socket, head) => {
    const { pathname } = parseUrl(request.url);

    let handled = false;
    const handler = handlers[pathname];
    if (handler) {
      handled = true;
      handler.handleUpgrade(request, socket, head, (websocket) => {
        handler.emit('connection', websocket, request);
        this.emit('connection', websocket, request, pathname);
      });
    }

    if (!handled) {
      if (options.rejectUnhandled) {
        rejectSocket(socket);
      }
      this.emit('unhandled', socket); //  this is a net.Socket
    }
  });

  const sharedOptions = withoutProperties(options, PRIVATE_ATTRS);
  const exposedMethods = {
    createHandler: createHandlerCreator(handlers, sharedOptions),
    on: this.on.bind(this),
    once: this.once.bind(this),
    close: server.close.bind(server),
    get listening() {
      return server.listening;
    },
  };

  const listen = () => server.listen(options.port, "0.0.0.0");
  if (options.autoListen) {
    listen();
  } else {
    exposedMethods.listen = listen;
  }

  return exposedMethods;
}

inherits(MultipathServer, EventEmitter);

module.exports = MultipathServer;

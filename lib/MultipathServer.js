'use strict';

const { parse: parseUrl } = require('url');
const { createServer } = require('http');
const { withoutProperties } = require('./utils');
const { createHandlerCreator } = require('./createHandlerCreator');
const { inherits } = require('util');
const { EventEmitter } = require('events');

const PRIVATE_ATTRS = ['port', 'autoListen'];

function MultipathServer(options) {
  if (typeof options.port !== 'number') {
    throw new TypeError('A port number must be specified');
  }

  options = Object.assign({
    autoListen: true,
  }, options);

  function listen() {
    server.listen(options.port);
  }

  const server = createServer();
  const handlers = {};

  // Handle an HTTP upgrade request by delegating that request to the proper
  // websocket server if it exists
  server.on('upgrade', (request, socket, head) => {
    const { pathname } = parseUrl(request.url);

    let handled = false;

    for (let handlerName in handlers) {
      if (pathname === handlerName) {
        handled = true;
        const wss = handlers[handlerName];
        wss.handleUpgrade(request, socket, head, ws => {
          wss.emit('connection', ws);
        });
      }
    }

    // Handle unhandled sockets
    if (!handled) {
      this.emit('unhandled', socket);
      if (options.rejectUnhandled) {
        socket.destroy();
      }
    }
  });

  if (options.autoListen) {
    listen();
  }

  // exposed API
  const sharedOptions = withoutProperties(options, PRIVATE_ATTRS);
  const exports = {
    createHandler: createHandlerCreator(handlers, sharedOptions),
    on: this.on.bind(this),
  };

  if (!options.autoListen) {
    exports.listen = listen;
  };

  return exports;
}

inherits(MultipathServer, EventEmitter);

module.exports = MultipathServer;

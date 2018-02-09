'use strict';

const { createServer } = require('http');
const { EventEmitter } = require('events');
const { parse: parseUrl } = require('url');
const { inherits } = require('util');
const { withoutProperties } = require('./utils');
const { createHandlerCreator } = require('./createHandlerCreator');

const PRIVATE_ATTRS = ['port', 'autoListen'];

const defaults = {
  autoListen: true,
  rejectUnhandled: true,
};

function MultipathServer(options) {
  if (typeof options.port !== 'number') {
    throw new TypeError('A port number must be specified');
  }

  options = Object.assign({}, defaults, options);

  const handlers = {};
  const server = createServer();

  // Handle an HTTP upgrade request by delegating that request to the proper
  // websocket server if it exists
  server.on('upgrade', (request, socket, head) => {
    const { pathname } = parseUrl(request.url);

    let handled = false;
    const handler = handlers[pathname];
    if (handler) {
      handled = true;
      handler.handleUpgrade(request, socket, head, ws => {
        handler.emit('connection', ws);
        this.emit('connection', ws, pathname);
      });
    }

    if (!handled) {
      this.emit('unhandled', socket); //  this is a net.Socket
      if (options.rejectUnhandled) {
        socket.destroy();
      }
    }
  });

  function listen() {
    server.listen(options.port);
  }

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

'use strict';

const { Server } = require('ws');

function createHandlerCreator(handlers, sharedOptions) {
  return function createHandler(instanceOptions) {
    if (
      instanceOptions.port ||
      instanceOptions.host ||
      instanceOptions.server
    ) {
      throw new Error(
        'It appears that you have specified a port, a host or a server option ',
        'to a path-specific handler. A handler should not have neither of ',
        'those options.'
      );
    }

    if (typeof handlers[instanceOptions.pathname] !== 'undefined') {
      throw new Error(
        `A server handler for '${instanceOptions.pathname}' already exists`
      );
    }

    Object.assign(instanceOptions, sharedOptions, {
      noServer: true,
    });

    // console.log(instanceOptions);
    const wss = new Server(instanceOptions);
    handlers[instanceOptions.pathname] = wss;
    return wss;
  };
}

module.exports = {
  createHandlerCreator,
};

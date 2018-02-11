'use strict';

const { Server } = require('ws');
const { invariant, hasOwnProperty } = require('./utils');

function createHandlerCreator(handlers, sharedOptions) {
  return function createHandler(instanceOptions) {
    invariant(
      typeof instanceOptions !== 'undefined',
      'The "options" argument for a handler must be of type Object'
    );

    invariant(
      typeof instanceOptions.path === 'string',
      'The "options.path" option of a handler to be of type String'
    );

    invariant(
      !instanceOptions.port &&
      !instanceOptions.host &&
      !instanceOptions.server,
      'It appears that you have specified a port, a host or a server ' +
      'option to a path-specific handler. A handler should not have none ' +
      'of those options.'
    );

    invariant(
      !hasOwnProperty(handlers, instanceOptions.path),
      `A server handler for '${instanceOptions.path}' already exists`
    );

    Object.assign(instanceOptions, sharedOptions, {
      noServer: true,
    });

    const wss = new Server(instanceOptions);
    handlers[instanceOptions.path] = wss;
    return wss;
  };
}

module.exports = {
  createHandlerCreator,
};

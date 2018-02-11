'use-strict';

/**
 * Delegate events emitted from one EventEmitter to another
 * @param {Array<string>} events Events to be delegated
 * @param {EventEmitter} source Original EventEmitter to listen to
 * @param {EventEmitter} target Target EventEmitter to emit events of the source
 */
function delegateEmittedEvents(events, source, target) {
  for (let event of events) {
    source.on(event, (...args) => target.emit(event, ...args));
  }
}

module.exports = {
  delegateEmittedEvents,
};

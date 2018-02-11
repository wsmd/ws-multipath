'use strict';

function hasOwnProperty(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

function withoutProperties(obj, keys) {
  const target = {};
  for (let key in obj) {
    if (hasOwnProperty(obj, key) && !keys.includes(key)) {
      target[key] = obj[key];
    };
  }
  return target;
}

function invariant(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

module.exports = {
  hasOwnProperty,
  withoutProperties,
  invariant,
};

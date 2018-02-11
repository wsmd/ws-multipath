'use strict';

const hasOwnProperty = (obj, key) =>
  Object.prototype.hasOwnProperty.call(obj, key);

function withoutProperties(obj, keys) {
  const target = {};
  for (let key in obj) {
    if (hasOwnProperty(obj, key) && !keys.includes(key)) {
      target[key] = obj[key];
    };
  }
  return target;
}

module.exports = {
  withoutProperties,
};

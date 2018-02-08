'use strict';

function withoutProperties(obj, keys) {
  const target = {};
  for (let key in obj) {
    if (keys.includes(key)) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
    target[key] = obj[key];
  }
  return target;
}

module.exports = {
  withoutProperties,
};

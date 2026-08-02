const NodeCache = require('node-cache');

function createCache({ ttlSeconds }) {
  const store = new NodeCache({ stdTTL: ttlSeconds, useClones: false });

  return {
    get: (key) => store.get(key),
    set: (key, value, ttlSeconds) =>
      ttlSeconds === undefined ? store.set(key, value) : store.set(key, value, ttlSeconds),
    has: (key) => store.has(key),
  };
}

module.exports = { createCache };

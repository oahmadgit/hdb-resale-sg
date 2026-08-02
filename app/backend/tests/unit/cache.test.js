const { createCache } = require('../../src/utils/cache');

describe('createCache', () => {
  it('stores and retrieves a value', () => {
    const cache = createCache({ ttlSeconds: 60 });
    cache.set('key', { foo: 'bar' });
    expect(cache.get('key')).toEqual({ foo: 'bar' });
  });

  it('reports has() correctly', () => {
    const cache = createCache({ ttlSeconds: 60 });
    expect(cache.has('missing')).toBe(false);
    cache.set('present', 1);
    expect(cache.has('present')).toBe(true);
  });

  it('returns undefined for missing keys', () => {
    const cache = createCache({ ttlSeconds: 60 });
    expect(cache.get('missing')).toBeUndefined();
  });

  it('expires entries after the configured TTL', async () => {
    const cache = createCache({ ttlSeconds: 0.05 });
    cache.set('key', 'value');
    expect(cache.get('key')).toBe('value');

    await new Promise((resolve) => setTimeout(resolve, 150));

    expect(cache.get('key')).toBeUndefined();
    expect(cache.has('key')).toBe(false);
  });

  it('allows overriding the TTL per key', async () => {
    const cache = createCache({ ttlSeconds: 60 });
    cache.set('short-lived', 'value', 0.05);

    await new Promise((resolve) => setTimeout(resolve, 150));

    expect(cache.get('short-lived')).toBeUndefined();
  });
});

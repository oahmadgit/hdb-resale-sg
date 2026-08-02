const { createResaleService } = require('../../src/services/resale.service');

function makeCache() {
  const store = new Map();
  return {
    get: (key) => store.get(key),
    set: (key, value) => store.set(key, value),
    has: (key) => store.has(key),
  };
}

function rateLimitError() {
  const err = new Error('Request failed with status code 429');
  err.response = { status: 429 };
  return err;
}

describe('resale.service — retry on rate limiting', () => {
  it('retries a 429 and succeeds on a later attempt', async () => {
    const records = [{ id: 1 }];
    const get = jest
      .fn()
      .mockRejectedValueOnce(rateLimitError())
      .mockResolvedValueOnce({ data: { result: { total: 1, records } } });

    const cache = makeCache();
    const service = createResaleService({
      httpClient: { get },
      cache,
      resourceId: 'abc',
      maxConcurrentFetches: 5,
      retry: { retries: 3, baseDelayMs: 1 },
    });

    const result = await service.fetchAllRecords({});

    expect(result).toEqual(records);
    expect(get).toHaveBeenCalledTimes(2);
  });

  it('gives up after exhausting retries and propagates the error', async () => {
    const get = jest.fn().mockRejectedValue(rateLimitError());
    const cache = makeCache();
    const service = createResaleService({
      httpClient: { get },
      cache,
      resourceId: 'abc',
      maxConcurrentFetches: 5,
      retry: { retries: 2, baseDelayMs: 1 },
    });

    await expect(service.fetchAllRecords({})).rejects.toThrow('429');
    expect(get).toHaveBeenCalledTimes(3); // initial + 2 retries
  });

  it('does not retry non-429 errors', async () => {
    const err = new Error('Request failed with status code 500');
    err.response = { status: 500 };
    const get = jest.fn().mockRejectedValue(err);
    const cache = makeCache();
    const service = createResaleService({
      httpClient: { get },
      cache,
      resourceId: 'abc',
      maxConcurrentFetches: 5,
      retry: { retries: 3, baseDelayMs: 1 },
    });

    await expect(service.fetchAllRecords({})).rejects.toThrow('500');
    expect(get).toHaveBeenCalledTimes(1);
  });
});

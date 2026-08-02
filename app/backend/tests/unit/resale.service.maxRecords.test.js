const { createResaleService } = require('../../src/services/resale.service');

function makeCache() {
  const store = new Map();
  return {
    get: (key) => store.get(key),
    set: (key, value) => store.set(key, value),
    has: (key) => store.has(key),
  };
}

describe('resale.service — maxRecords cap', () => {
  it('stops fetching once the configured maxRecords is reached, instead of fetching every page', async () => {
    // total is 10,000 (100 pages), but we cap at 300 records (3 pages)
    const get = jest.fn((_path, { params }) => {
      const records = Array.from({ length: 100 }, (_, i) => ({ id: params.offset + i }));
      return Promise.resolve({ data: { result: { total: 10000, records } } });
    });
    const cache = makeCache();
    const service = createResaleService({
      httpClient: { get },
      cache,
      resourceId: 'abc',
      maxConcurrentFetches: 5,
      maxRecords: 300,
      retry: { retries: 0, baseDelayMs: 1 },
    });

    const result = await service.fetchAllRecords({});

    expect(result).toHaveLength(300);
    expect(get).toHaveBeenCalledTimes(3);
  });

  it('does not over-fetch when total is already below the cap', async () => {
    const records = [{ id: 1 }, { id: 2 }];
    const get = jest.fn(() =>
      Promise.resolve({ data: { result: { total: 2, records } } })
    );
    const cache = makeCache();
    const service = createResaleService({
      httpClient: { get },
      cache,
      resourceId: 'abc',
      maxConcurrentFetches: 5,
      maxRecords: 2000,
    });

    const result = await service.fetchAllRecords({});

    expect(result).toEqual(records);
    expect(get).toHaveBeenCalledTimes(1);
  });
});

const { createResaleService } = require('../../src/services/resale.service');

function makeHttpClient(pages) {
  // pages: array of { total, records } indexed by offset/100
  return {
    get: jest.fn((_path, { params }) => {
      const pageIndex = params.offset / 100;
      const page = pages[pageIndex];
      return Promise.resolve({
        data: { result: { total: pages.total, records: page } },
      });
    }),
  };
}

function makeCache() {
  const store = new Map();
  return {
    get: jest.fn((key) => store.get(key)),
    set: jest.fn((key, value) => store.set(key, value)),
    has: jest.fn((key) => store.has(key)),
  };
}

describe('resale.service — fetchAllRecords', () => {
  it('fetches a single page when total <= 100', async () => {
    const records = [{ id: 1 }, { id: 2 }];
    const httpClient = makeHttpClient([records]);
    httpClient.get.mockImplementationOnce((_path, { params }) => {
      expect(params.offset).toBe(0);
      expect(params.limit).toBe(100);
      return Promise.resolve({ data: { result: { total: 2, records } } });
    });
    const cache = makeCache();
    const service = createResaleService({
      httpClient,
      cache,
      resourceId: 'abc',
      maxConcurrentFetches: 5,
    });

    const result = await service.fetchAllRecords({});

    expect(result).toEqual(records);
    expect(httpClient.get).toHaveBeenCalledTimes(1);
  });

  it('paginates across multiple pages and assembles the full result set', async () => {
    const page0 = Array.from({ length: 100 }, (_, i) => ({ id: i }));
    const page1 = Array.from({ length: 100 }, (_, i) => ({ id: 100 + i }));
    const page2 = [{ id: 200 }];
    const total = 201;

    const httpClient = {
      get: jest.fn((_path, { params }) => {
        const pages = { 0: page0, 100: page1, 200: page2 };
        return Promise.resolve({ data: { result: { total, records: pages[params.offset] } } });
      }),
    };
    const cache = makeCache();
    const service = createResaleService({
      httpClient,
      cache,
      resourceId: 'abc',
      maxConcurrentFetches: 5,
    });

    const result = await service.fetchAllRecords({});

    expect(result).toHaveLength(201);
    expect(httpClient.get).toHaveBeenCalledTimes(3);
  });

  it('returns cached records without calling the HTTP client on a cache hit', async () => {
    const cached = [{ id: 1 }];
    const httpClient = { get: jest.fn() };
    const cache = makeCache();
    cache.set('resale:{}', cached);

    const service = createResaleService({
      httpClient,
      cache,
      resourceId: 'abc',
      maxConcurrentFetches: 5,
    });

    const result = await service.fetchAllRecords({});

    expect(result).toBe(cached);
    expect(httpClient.get).not.toHaveBeenCalled();
  });

  it('builds distinct cache keys for distinct filters', async () => {
    const httpClient = makeHttpClient([[]]);
    httpClient.get.mockImplementation(() =>
      Promise.resolve({ data: { result: { total: 0, records: [] } } })
    );
    const cache = makeCache();
    const service = createResaleService({
      httpClient,
      cache,
      resourceId: 'abc',
      maxConcurrentFetches: 5,
    });

    await service.fetchAllRecords({ town: 'BEDOK' });
    await service.fetchAllRecords({ town: 'TAMPINES' });

    const cacheKeys = cache.set.mock.calls.map(([key]) => key);
    expect(new Set(cacheKeys).size).toBe(2);
  });

  it('caches the assembled result after fetching', async () => {
    const records = [{ id: 1 }];
    const httpClient = {
      get: jest.fn(() => Promise.resolve({ data: { result: { total: 1, records } } })),
    };
    const cache = makeCache();
    const service = createResaleService({
      httpClient,
      cache,
      resourceId: 'abc',
      maxConcurrentFetches: 5,
    });

    await service.fetchAllRecords({});

    expect(cache.set).toHaveBeenCalledWith(expect.any(String), records);
  });

  it('propagates errors from the HTTP client', async () => {
    const httpClient = { get: jest.fn(() => Promise.reject(new Error('network down'))) };
    const cache = makeCache();
    const service = createResaleService({
      httpClient,
      cache,
      resourceId: 'abc',
      maxConcurrentFetches: 5,
    });

    await expect(service.fetchAllRecords({})).rejects.toThrow('network down');
  });
});

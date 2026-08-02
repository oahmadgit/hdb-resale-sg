const { createResaleService, buildCacheKey } = require('../../src/services/resale.service');

function makeDatasetService(records) {
  return { getAllRecords: jest.fn(() => records) };
}

function makeCache() {
  const store = new Map();
  return {
    get: jest.fn((key) => store.get(key)),
    set: jest.fn((key, value) => store.set(key, value)),
    has: jest.fn((key) => store.has(key)),
  };
}

const RECORDS = [
  { month: '2024-01', town: 'TAMPINES', flat_type: '4 ROOM', storey_range: '07 TO 09', resale_price: 500000 },
  { month: '2024-02', town: 'BEDOK', flat_type: '4 ROOM', storey_range: '01 TO 03', resale_price: 480000 },
  { month: '2024-02', town: 'TAMPINES', flat_type: '3 ROOM', storey_range: '10 TO 12', resale_price: 400000 },
];

describe('resale.service — fetchAllRecords', () => {
  it('returns all records when no filters are given', async () => {
    const service = createResaleService({ datasetService: makeDatasetService(RECORDS), cache: makeCache() });

    const result = await service.fetchAllRecords({});

    expect(result).toEqual(RECORDS);
  });

  it('filters records by a single-value field', async () => {
    const service = createResaleService({ datasetService: makeDatasetService(RECORDS), cache: makeCache() });

    const result = await service.fetchAllRecords({ town: 'BEDOK' });

    expect(result).toEqual([RECORDS[1]]);
  });

  it('OR-matches a comma-separated filter value across multiple towns', async () => {
    const service = createResaleService({ datasetService: makeDatasetService(RECORDS), cache: makeCache() });

    const result = await service.fetchAllRecords({ town: 'TAMPINES,BEDOK' });

    expect(result).toHaveLength(3);
  });

  it('combines multiple filter fields with AND semantics', async () => {
    const service = createResaleService({ datasetService: makeDatasetService(RECORDS), cache: makeCache() });

    const result = await service.fetchAllRecords({ town: 'TAMPINES', flat_type: '3 ROOM' });

    expect(result).toEqual([RECORDS[2]]);
  });

  it('ignores undefined and empty-string filter values', async () => {
    const service = createResaleService({ datasetService: makeDatasetService(RECORDS), cache: makeCache() });

    const result = await service.fetchAllRecords({ town: undefined, flat_type: '' });

    expect(result).toEqual(RECORDS);
  });

  it('returns cached results without re-reading the dataset on a cache hit', async () => {
    const cached = [{ id: 1 }];
    const datasetService = makeDatasetService(RECORDS);
    const cache = makeCache();
    cache.set(buildCacheKey({}), cached);

    const service = createResaleService({ datasetService, cache });
    const result = await service.fetchAllRecords({});

    expect(result).toBe(cached);
    expect(datasetService.getAllRecords).not.toHaveBeenCalled();
  });

  it('caches the filtered result after computing it', async () => {
    const cache = makeCache();
    const service = createResaleService({ datasetService: makeDatasetService(RECORDS), cache });

    await service.fetchAllRecords({ town: 'BEDOK' });

    expect(cache.set).toHaveBeenCalledWith(expect.any(String), [RECORDS[1]]);
  });

  it('builds distinct cache keys for distinct filters', async () => {
    const cache = makeCache();
    const service = createResaleService({ datasetService: makeDatasetService(RECORDS), cache });

    await service.fetchAllRecords({ town: 'BEDOK' });
    await service.fetchAllRecords({ town: 'TAMPINES' });

    const cacheKeys = cache.set.mock.calls.map(([key]) => key);
    expect(new Set(cacheKeys).size).toBe(2);
  });
});

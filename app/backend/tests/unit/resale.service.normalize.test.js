const { createResaleService, normalizeRecord } = require('../../src/services/resale.service');

describe('normalizeRecord', () => {
  it('coerces resale_price, floor_area_sqm, and lease_commence_date to numbers', () => {
    const raw = {
      month: '2017-01',
      town: 'ANG MO KIO',
      flat_type: '2 ROOM',
      storey_range: '10 TO 12',
      floor_area_sqm: '44',
      flat_model: 'Improved',
      lease_commence_date: '1979',
      resale_price: '232000',
    };

    const normalized = normalizeRecord(raw);

    expect(normalized.resale_price).toBe(232000);
    expect(normalized.floor_area_sqm).toBe(44);
    expect(normalized.lease_commence_date).toBe(1979);
    expect(typeof normalized.resale_price).toBe('number');
    expect(typeof normalized.floor_area_sqm).toBe('number');
  });

  it('leaves string fields (month, town, flat_type, storey_range) untouched', () => {
    const raw = { month: '2017-01', town: 'BEDOK', resale_price: '100000', floor_area_sqm: '80' };
    const normalized = normalizeRecord(raw);
    expect(normalized.month).toBe('2017-01');
    expect(normalized.town).toBe('BEDOK');
  });

  it('passes through already-numeric fields unchanged', () => {
    const normalized = normalizeRecord({ resale_price: 500000, floor_area_sqm: 90 });
    expect(normalized.resale_price).toBe(500000);
    expect(normalized.floor_area_sqm).toBe(90);
  });

  it('does not choke on missing numeric fields', () => {
    expect(() => normalizeRecord({ town: 'BEDOK' })).not.toThrow();
  });
});

describe('resale.service — fetchAllRecords normalizes numeric fields from data.gov.sg', () => {
  it('coerces string numeric fields on every fetched record', async () => {
    const rawRecords = [
      { town: 'BEDOK', resale_price: '480000', floor_area_sqm: '88', lease_commence_date: '1985' },
    ];
    const httpClient = {
      get: jest.fn(() =>
        Promise.resolve({ data: { result: { total: 1, records: rawRecords } } })
      ),
    };
    const store = new Map();
    const cache = {
      get: (key) => store.get(key),
      set: (key, value) => store.set(key, value),
      has: (key) => store.has(key),
    };
    const service = createResaleService({
      httpClient,
      cache,
      resourceId: 'abc',
      maxConcurrentFetches: 5,
    });

    const [record] = await service.fetchAllRecords({});

    expect(record.resale_price).toBe(480000);
    expect(record.floor_area_sqm).toBe(88);
    expect(record.lease_commence_date).toBe(1985);
  });
});

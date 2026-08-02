const path = require('path');
const { createDatasetService } = require('../../src/services/dataset.service');

const FIXTURES_DIR = path.join(__dirname, '../fixtures/data');

describe('dataset.service', () => {
  it('loads and merges records from every CSV file in the data directory', () => {
    const service = createDatasetService({ dataDir: FIXTURES_DIR });

    const records = service.getAllRecords();

    expect(records.length).toBe(4);
    expect(records.map((r) => r.town).sort()).toEqual(['ANG MO KIO', 'ANG MO KIO', 'BEDOK', 'BEDOK']);
  });

  it('normalizes numeric fields on every loaded record', () => {
    const service = createDatasetService({ dataDir: FIXTURES_DIR });

    const [record] = service.getAllRecords();

    expect(typeof record.resale_price).toBe('number');
    expect(typeof record.floor_area_sqm).toBe('number');
  });

  it('only loads the dataset once even when getAllRecords is called multiple times', () => {
    const service = createDatasetService({ dataDir: FIXTURES_DIR });

    const first = service.getAllRecords();
    const second = service.getAllRecords();

    expect(first).toBe(second);
  });

  it('throws a clear error when the data directory does not exist', () => {
    const service = createDatasetService({ dataDir: path.join(__dirname, '../fixtures/does-not-exist') });

    expect(() => service.getAllRecords()).toThrow(/data directory/i);
  });
});

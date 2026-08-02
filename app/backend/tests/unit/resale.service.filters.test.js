const { buildCkanFilters } = require('../../src/services/resale.service');

describe('buildCkanFilters', () => {
  it('returns undefined when no filters are provided', () => {
    expect(buildCkanFilters({})).toBeUndefined();
  });

  it('omits undefined and empty-string values', () => {
    expect(buildCkanFilters({ town: undefined, flat_type: '' })).toBeUndefined();
  });

  it('wraps a single value as a single-element array', () => {
    expect(JSON.parse(buildCkanFilters({ flat_type: '4 ROOM' }))).toEqual({
      flat_type: ['4 ROOM'],
    });
  });

  it('splits a comma-separated value into multiple array entries (CKAN OR-matches an array)', () => {
    expect(JSON.parse(buildCkanFilters({ town: 'TAMPINES,BEDOK' }))).toEqual({
      town: ['TAMPINES', 'BEDOK'],
    });
  });

  it('trims whitespace around comma-separated values', () => {
    expect(JSON.parse(buildCkanFilters({ town: 'TAMPINES, BEDOK , ANG MO KIO' }))).toEqual({
      town: ['TAMPINES', 'BEDOK', 'ANG MO KIO'],
    });
  });

  it('combines multiple filter fields', () => {
    expect(JSON.parse(buildCkanFilters({ town: 'TAMPINES', flat_type: '4 ROOM' }))).toEqual({
      town: ['TAMPINES'],
      flat_type: ['4 ROOM'],
    });
  });
});

const {
  groupBy,
  toMonthlyTimeSeries,
  computePSM,
  summariseByTown,
} = require('../../src/services/aggregation.service');

const sample = [
  { month: '2024-01', town: 'TAMPINES', resale_price: 500000, floor_area_sqm: 90 },
  { month: '2024-01', town: 'TAMPINES', resale_price: 520000, floor_area_sqm: 95 },
  { month: '2024-02', town: 'TAMPINES', resale_price: 540000, floor_area_sqm: 100 },
  { month: '2024-01', town: 'BEDOK', resale_price: 480000, floor_area_sqm: 88 },
];

describe('groupBy', () => {
  it('groups records by the given field', () => {
    const grouped = groupBy(sample, 'town');
    expect(Object.keys(grouped).sort()).toEqual(['BEDOK', 'TAMPINES']);
    expect(grouped.TAMPINES).toHaveLength(3);
    expect(grouped.BEDOK).toHaveLength(1);
  });

  it('returns an empty object for an empty array', () => {
    expect(groupBy([], 'town')).toEqual({});
  });
});

describe('toMonthlyTimeSeries', () => {
  it('sorts ascending by month and computes correct medians and counts', () => {
    const series = toMonthlyTimeSeries(sample);
    expect(series).toEqual([
      { month: '2024-01', median: 500000, count: 3 },
      { month: '2024-02', median: 540000, count: 1 },
    ]);
  });

  it('returns an empty array for no records', () => {
    expect(toMonthlyTimeSeries([])).toEqual([]);
  });
});

describe('computePSM', () => {
  it('adds a psm field computed as resale_price / floor_area_sqm', () => {
    const [first] = computePSM([{ resale_price: 500000, floor_area_sqm: 100 }]);
    expect(first.psm).toBe(5000);
  });

  it('does not mutate the original records', () => {
    const input = [{ resale_price: 500000, floor_area_sqm: 100 }];
    computePSM(input);
    expect(input[0].psm).toBeUndefined();
  });
});

describe('summariseByTown', () => {
  it('computes median, min, max, count per town', () => {
    const summary = summariseByTown(sample);
    const tampines = summary.find((s) => s.town === 'TAMPINES');
    expect(tampines).toEqual({
      town: 'TAMPINES',
      median: 520000,
      min: 500000,
      max: 540000,
      count: 3,
    });
  });

  it('returns an empty array for no records', () => {
    expect(summariseByTown([])).toEqual([]);
  });
});

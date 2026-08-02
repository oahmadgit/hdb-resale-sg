const { buildTrendsSeries } = require('../../src/services/aggregation.service');

function makeRecords() {
  return [
    { month: '2024-01', town: 'TAMPINES', resale_price: 500000 },
    { month: '2024-01', town: 'TAMPINES', resale_price: 520000 },
    { month: '2024-02', town: 'TAMPINES', resale_price: 540000 },
    { month: '2024-02', town: 'BEDOK', resale_price: 480000 },
    { month: '2023-02', town: 'TAMPINES', resale_price: 450000 },
  ];
}

describe('buildTrendsSeries', () => {
  it('groups records into a per-town monthly series', () => {
    const { series } = buildTrendsSeries(makeRecords());

    const townNames = series.map((s) => s.town).sort();
    expect(townNames).toEqual(['BEDOK', 'TAMPINES']);

    const tampines = series.find((s) => s.town === 'TAMPINES');
    expect(tampines.data).toEqual([
      { month: '2023-02', median: 450000, count: 1 },
      { month: '2024-01', median: 510000, count: 2 },
      { month: '2024-02', median: 540000, count: 1 },
    ]);
  });

  it('computes KPIs: currentMedian, momChange, yoyChange, totalTransactions', () => {
    const { kpis } = buildTrendsSeries(makeRecords());

    expect(kpis.totalTransactions).toBe(5);
    // currentMedian = median of the latest month (2024-02) across all towns: [540000, 480000] -> 510000
    expect(kpis.currentMedian).toBe(510000);
  });

  it('computes momChange as the % change from the prior month to the latest month', () => {
    const records = [
      { month: '2024-01', town: 'TAMPINES', resale_price: 500000 },
      { month: '2024-02', town: 'TAMPINES', resale_price: 550000 },
    ];
    const { kpis } = buildTrendsSeries(records);
    expect(kpis.momChange).toBeCloseTo(0.1, 5);
  });

  it('computes yoyChange as the % change from 12 months prior to the latest month', () => {
    const records = [
      { month: '2023-02', town: 'TAMPINES', resale_price: 400000 },
      { month: '2024-02', town: 'TAMPINES', resale_price: 500000 },
    ];
    const { kpis } = buildTrendsSeries(records);
    expect(kpis.yoyChange).toBeCloseTo(0.25, 5);
  });

  it('returns null momChange/yoyChange when comparison months have no data', () => {
    const records = [{ month: '2024-02', town: 'TAMPINES', resale_price: 500000 }];
    const { kpis } = buildTrendsSeries(records);
    expect(kpis.momChange).toBeNull();
    expect(kpis.yoyChange).toBeNull();
  });

  it('handles an empty record set', () => {
    const { kpis, series } = buildTrendsSeries([]);
    expect(series).toEqual([]);
    expect(kpis).toEqual({
      currentMedian: null,
      momChange: null,
      yoyChange: null,
      totalTransactions: 0,
    });
  });
});

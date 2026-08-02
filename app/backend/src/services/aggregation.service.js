const { median } = require('../utils/math');

function groupBy(records, key) {
  return records.reduce((acc, record) => {
    const value = record[key];
    (acc[value] ||= []).push(record);
    return acc;
  }, {});
}

function toMonthlyTimeSeries(records) {
  const byMonth = groupBy(records, 'month');

  return Object.keys(byMonth)
    .sort()
    .map((month) => {
      const monthRecords = byMonth[month];
      return {
        month,
        median: median(monthRecords.map((r) => r.resale_price)),
        count: monthRecords.length,
      };
    });
}

function computePSM(records) {
  return records.map((record) => ({
    ...record,
    psm: record.resale_price / record.floor_area_sqm,
  }));
}

function summariseByTown(records) {
  const byTown = groupBy(records, 'town');

  return Object.keys(byTown).map((town) => {
    const prices = byTown[town].map((r) => r.resale_price);
    return {
      town,
      median: median(prices),
      min: Math.min(...prices),
      max: Math.max(...prices),
      count: prices.length,
    };
  });
}

function shiftMonth(month, offset) {
  const [year, monthNum] = month.split('-').map(Number);
  const date = new Date(Date.UTC(year, monthNum - 1 + offset, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}

function buildTrendsSeries(records) {
  if (records.length === 0) {
    return {
      series: [],
      kpis: { currentMedian: null, momChange: null, yoyChange: null, totalTransactions: 0 },
    };
  }

  const byTown = groupBy(records, 'town');
  const series = Object.keys(byTown)
    .sort()
    .map((town) => ({ town, data: toMonthlyTimeSeries(byTown[town]) }));

  const byMonth = groupBy(records, 'month');
  const months = Object.keys(byMonth).sort();
  const latestMonth = months[months.length - 1];
  const currentMedian = median(byMonth[latestMonth].map((r) => r.resale_price));

  const priorMonth = shiftMonth(latestMonth, -1);
  const priorMedian = byMonth[priorMonth] ? median(byMonth[priorMonth].map((r) => r.resale_price)) : null;
  const momChange = priorMedian ? (currentMedian - priorMedian) / priorMedian : null;

  const yoyMonth = shiftMonth(latestMonth, -12);
  const yoyMedian = byMonth[yoyMonth] ? median(byMonth[yoyMonth].map((r) => r.resale_price)) : null;
  const yoyChange = yoyMedian ? (currentMedian - yoyMedian) / yoyMedian : null;

  return {
    series,
    kpis: {
      currentMedian,
      momChange,
      yoyChange,
      totalTransactions: records.length,
    },
  };
}

module.exports = {
  groupBy,
  toMonthlyTimeSeries,
  computePSM,
  summariseByTown,
  buildTrendsSeries,
};

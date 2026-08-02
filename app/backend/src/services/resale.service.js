const NUMERIC_FIELDS = ['resale_price', 'floor_area_sqm', 'lease_commence_date'];

function normalizeRecord(record) {
  const normalized = { ...record };
  for (const field of NUMERIC_FIELDS) {
    if (normalized[field] !== undefined) {
      normalized[field] = Number(normalized[field]);
    }
  }
  return normalized;
}

function buildCacheKey(filters) {
  const sortedEntries = Object.keys(filters)
    .sort()
    .map((key) => [key, filters[key]]);
  return `resale:${JSON.stringify(Object.fromEntries(sortedEntries))}`;
}

function toValueSet(filterValue) {
  if (filterValue === undefined || filterValue === '') return undefined;
  return new Set(String(filterValue).split(',').map((v) => v.trim()));
}

function matchesFilters(record, filterSets) {
  for (const [field, values] of filterSets) {
    if (values && !values.has(record[field])) return false;
  }
  return true;
}

function createResaleService({ datasetService, cache }) {
  async function fetchAllRecords(filters) {
    const cacheKey = buildCacheKey(filters);
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    const filterSets = Object.entries(filters).map(([field, value]) => [field, toValueSet(value)]);
    const matched = datasetService.getAllRecords().filter((record) => matchesFilters(record, filterSets));

    cache.set(cacheKey, matched);
    return matched;
  }

  return { fetchAllRecords };
}

module.exports = { createResaleService, buildCacheKey, normalizeRecord };

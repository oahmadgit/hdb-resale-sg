const PAGE_SIZE = 100;
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

function buildCkanFilters(filters) {
  const entries = Object.entries(filters).filter(([, value]) => value !== undefined && value !== '');
  if (entries.length === 0) return undefined;

  const ckanFilters = Object.fromEntries(
    entries.map(([key, value]) => [key, String(value).split(',').map((v) => v.trim())])
  );

  return JSON.stringify(ckanFilters);
}

function buildCacheKey(filters) {
  const sortedEntries = Object.keys(filters)
    .sort()
    .map((key) => [key, filters[key]]);
  return `resale:${JSON.stringify(Object.fromEntries(sortedEntries))}`;
}

function chunkArray(items, size) {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

const DEFAULT_RETRY = { retries: 5, baseDelayMs: 500 };
const INTER_BATCH_DELAY_MS = 250;
const DEFAULT_MAX_RECORDS = 2000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRateLimitError(err) {
  return err.response?.status === 429;
}

function createResaleService({
  httpClient,
  cache,
  resourceId,
  maxConcurrentFetches,
  retry = DEFAULT_RETRY,
  maxRecords = DEFAULT_MAX_RECORDS,
}) {
  async function fetchPage(filters, offset, attempt = 0) {
    try {
      const response = await httpClient.get('', {
        params: {
          resource_id: resourceId,
          filters: buildCkanFilters(filters),
          limit: PAGE_SIZE,
          offset,
        },
      });
      return response.data.result;
    } catch (err) {
      if (isRateLimitError(err) && attempt < retry.retries) {
        await sleep(retry.baseDelayMs * 2 ** attempt);
        return fetchPage(filters, offset, attempt + 1);
      }
      throw err;
    }
  }

  async function fetchAllRecords(filters) {
    const cacheKey = buildCacheKey(filters);
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    const first = await fetchPage(filters, 0);
    const recordsToFetch = Math.min(first.total, maxRecords);
    const totalPages = Math.ceil(recordsToFetch / PAGE_SIZE);
    const remainingOffsets = Array.from({ length: Math.max(totalPages - 1, 0) }, (_, i) => (i + 1) * PAGE_SIZE);

    const records = [...first.records];
    const chunks = chunkArray(remainingOffsets, maxConcurrentFetches);
    for (const [index, offsetChunk] of chunks.entries()) {
      if (index > 0) {
        await sleep(INTER_BATCH_DELAY_MS);
      }
      const pages = await Promise.all(offsetChunk.map((offset) => fetchPage(filters, offset)));
      for (const page of pages) {
        records.push(...page.records);
      }
    }

    const normalized = records.map(normalizeRecord);
    cache.set(cacheKey, normalized);
    return normalized;
  }

  return { fetchAllRecords };
}

module.exports = { createResaleService, buildCacheKey, normalizeRecord, buildCkanFilters };

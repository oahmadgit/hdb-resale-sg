const PAGE_SIZE = 100;

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

function createResaleService({ httpClient, cache, resourceId, maxConcurrentFetches }) {
  async function fetchPage(filters, offset) {
    const response = await httpClient.get('', {
      params: { resource_id: resourceId, ...filters, limit: PAGE_SIZE, offset },
    });
    return response.data.result;
  }

  async function fetchAllRecords(filters) {
    const cacheKey = buildCacheKey(filters);
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    const first = await fetchPage(filters, 0);
    const totalPages = Math.ceil(first.total / PAGE_SIZE);
    const remainingOffsets = Array.from({ length: Math.max(totalPages - 1, 0) }, (_, i) => (i + 1) * PAGE_SIZE);

    const records = [...first.records];
    for (const offsetChunk of chunkArray(remainingOffsets, maxConcurrentFetches)) {
      const pages = await Promise.all(offsetChunk.map((offset) => fetchPage(filters, offset)));
      for (const page of pages) {
        records.push(...page.records);
      }
    }

    cache.set(cacheKey, records);
    return records;
  }

  return { fetchAllRecords };
}

module.exports = { createResaleService, buildCacheKey };

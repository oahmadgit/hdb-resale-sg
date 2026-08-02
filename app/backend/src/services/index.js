const { createCache } = require('../utils/cache');
const { createHttpClient } = require('../utils/httpClient');
const { createResaleService } = require('./resale.service');
const { createAffordabilityService } = require('./affordability.service');

function createServices(config) {
  const cache = createCache({ ttlSeconds: config.CACHE_TTL_SECONDS });
  const httpClient = createHttpClient({ timeoutMs: config.REQUEST_TIMEOUT_MS });

  const resaleService = createResaleService({
    httpClient,
    cache,
    resourceId: config.DATA_GOV_RESOURCE_ID,
    maxConcurrentFetches: config.MAX_CONCURRENT_FETCHES,
    maxRecords: config.MAX_RECORDS_PER_QUERY,
  });

  const affordabilityService = createAffordabilityService({ resaleService });

  return { resaleService, affordabilityService };
}

module.exports = { createServices };

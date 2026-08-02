const { createCache } = require('../utils/cache');
const { createDatasetService } = require('./dataset.service');
const { createResaleService } = require('./resale.service');
const { createAffordabilityService } = require('./affordability.service');

function createServices(config) {
  const cache = createCache({ ttlSeconds: config.CACHE_TTL_SECONDS });
  const datasetService = createDatasetService({ dataDir: config.DATA_DIR });

  const resaleService = createResaleService({ datasetService, cache });
  const affordabilityService = createAffordabilityService({ resaleService });

  return { resaleService, affordabilityService };
}

module.exports = { createServices };

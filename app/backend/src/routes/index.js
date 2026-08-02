const { Router } = require('express');

const healthRoutes = require('./health.routes');
const { createAffordabilityRouter } = require('./affordability.routes');
const { createTrendsRouter } = require('./trends.routes');

function createRoutes({ affordabilityController, trendsController }) {
  const router = Router();

  router.use('/health', healthRoutes);
  router.use('/affordability', createAffordabilityRouter({ affordabilityController }));
  router.use('/trends', createTrendsRouter({ trendsController }));

  return router;
}

module.exports = { createRoutes };

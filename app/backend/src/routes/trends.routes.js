const { Router } = require('express');

const { validateQuery } = require('../middleware/validate');
const { trendsQuerySchema } = require('./schemas');

function createTrendsRouter({ trendsController }) {
  const router = Router();

  router.get('/', validateQuery(trendsQuerySchema), trendsController.getTrends);

  return router;
}

module.exports = { createTrendsRouter };

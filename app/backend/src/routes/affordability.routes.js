const { Router } = require('express');

const { validateQuery } = require('../middleware/validate');
const { affordabilityQuerySchema } = require('./schemas');

function createAffordabilityRouter({ affordabilityController }) {
  const router = Router();

  router.get(
    '/',
    validateQuery(affordabilityQuerySchema),
    affordabilityController.getAffordability
  );

  return router;
}

module.exports = { createAffordabilityRouter };

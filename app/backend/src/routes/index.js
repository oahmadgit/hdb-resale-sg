const { Router } = require('express');

const healthRoutes = require('./health.routes');
const affordabilityRoutes = require('./affordability.routes');
const trendsRoutes = require('./trends.routes');

const router = Router();

router.use('/health', healthRoutes);
router.use('/affordability', affordabilityRoutes);
router.use('/trends', trendsRoutes);

module.exports = router;

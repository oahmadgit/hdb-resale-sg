const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const { createRoutes } = require('./routes');
const { createServices } = require('./services');
const { createAffordabilityController } = require('./controllers/affordability.controller');
const { createTrendsController } = require('./controllers/trends.controller');
const { createRequestLogger } = require('./middleware/requestLogger');
const { errorHandler } = require('./middleware/errorHandler');

function createApp({ config, logger, services }) {
  const app = express();

  const { resaleService, affordabilityService } = services ?? createServices(config);
  const affordabilityController = createAffordabilityController({ affordabilityService });
  const trendsController = createTrendsController({ resaleService });

  app.use(helmet());
  app.use(cors({ origin: config.CORS_ORIGIN }));
  app.use(express.json());
  app.use(createRequestLogger(logger));

  app.use('/api', createRoutes({ affordabilityController, trendsController }));

  app.use((_req, res) => {
    res.status(404).json({ error: { message: 'Not found', code: 'NOT_FOUND' } });
  });

  app.use(errorHandler);

  return app;
}

module.exports = { createApp };

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const routes = require('./routes');
const { createRequestLogger } = require('./middleware/requestLogger');
const { errorHandler } = require('./middleware/errorHandler');

function createApp({ config, logger }) {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: config.CORS_ORIGIN }));
  app.use(express.json());
  app.use(createRequestLogger(logger));

  app.use('/api', routes);

  app.use((_req, res) => {
    res.status(404).json({ error: { message: 'Not found', code: 'NOT_FOUND' } });
  });

  app.use(errorHandler);

  return app;
}

module.exports = { createApp };

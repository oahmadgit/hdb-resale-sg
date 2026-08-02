const pinoHttp = require('pino-http');

function createRequestLogger(logger) {
  return pinoHttp({
    logger,
    autoLogging: true,
    customLogLevel: (_req, res, err) => {
      if (err || res.statusCode >= 500) return 'error';
      if (res.statusCode >= 400) return 'warn';
      return 'info';
    },
  });
}

module.exports = { createRequestLogger };

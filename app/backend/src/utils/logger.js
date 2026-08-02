const pino = require('pino');

function createLogger({ level, nodeEnv }) {
  const transport =
    nodeEnv === 'production'
      ? undefined
      : { target: 'pino-pretty', options: { colorize: true, translateTime: 'HH:MM:ss' } };

  return pino({ level, transport });
}

module.exports = { createLogger };

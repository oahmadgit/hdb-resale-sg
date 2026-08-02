require('dotenv').config();

const { loadConfig } = require('./config');
const { createLogger } = require('./utils/logger');
const { createApp } = require('./app');

const config = loadConfig();
const logger = createLogger({ level: config.LOG_LEVEL, nodeEnv: config.NODE_ENV });
const app = createApp({ config, logger });

app.listen(config.PORT, () => {
  logger.info(`Backend listening on port ${config.PORT}`);
});

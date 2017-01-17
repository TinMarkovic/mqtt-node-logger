const merge = require('lodash/merge');

const defaultConfig = require('./default.json');

try {
  const localConfig = require('../mqtt-node-logger.settings.json');
  config = merge(defaultConfig, localConfig);
} catch (e) {
  if (e.code !== 'MODULE_NOT_FOUND') {
    console.log(`Module "local.js" failed to load. Error: ${e.message}`);
  } else {
    console.log(`Settings file not found, loading default settings.`);
    config = defaultConfig;
  }
}

module.exports = config;

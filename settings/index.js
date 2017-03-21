const merge = require('lodash/merge');

const defaultConfig = require('./default.json');

var pathToLocalConfig = process.env.TXOC_LOGGER_SETTINGS ? 
                        process.env.TXOC_LOGGER_SETTINGS : 
                        './txoc-logger.settings.json';

try {
  const localConfig = require(pathToLocalConfig);
  config = merge(defaultConfig, localConfig);
} catch (e) {
  if (e.code !== 'MODULE_NOT_FOUND') {
    console.log(`Settings failed to load. Error: ${e.message}`);
  } else {
    console.log(`Settings file not found, loading default settings.`);
    config = defaultConfig;
  }
}

module.exports = config;

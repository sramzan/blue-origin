// Node Modules & Global Configs
var path          = require('path'),
    globalConfigs = require(path.resolve(__dirname, '../configs/globalConfigs'));

var STEMMER_DIR = globalConfigs.paths.STEMMER_DIR,
    UTIL_DIR    = globalConfigs.paths.UTIL_DIR;

module.exports = {
  validator : require(UTIL_DIR + 'validations'),
  helpers   : require(UTIL_DIR + 'helpers'),
};

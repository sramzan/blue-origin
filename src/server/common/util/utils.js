var path          = require('path'),
    globalConfigs = require(path.resolve(__dirname, '../configs/globalConfigs'));

var STEMMER_DIR = globalConfigs.paths.STEMMER_DIR;

module.exports = {
  stemmer : require(STEMMER_DIR + 'wordListStemmer')
};

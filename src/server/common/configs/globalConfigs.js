// Configs for the global stem app
console.log('Loading global configs');
// Node Modules
var path = require('path');

// Dir Paths
var ROOT_DIRECTORY = path.resolve(__dirname, '../../../../src/'),
    LIB_DIR        = ROOT_DIRECTORY + '/server/lib/',
    UTIL_DIR       = ROOT_DIRECTORY + '/server/common/util/',
    CONTENT_DIR    = ROOT_DIRECTORY + '/server/common/content/',
    STEMMER_DIR    = ROOT_DIRECTORY + '/server/stemmer/';

// Consts
var SINGLE_WORD    = 'singleWord',
    WORD_LIST      = 'wordList';

// Export all configs
module.exports = {
  paths : {
    'ROOT_DIRECTORY' : ROOT_DIRECTORY,
    'LIB_DIR'        : LIB_DIR,
    'UTIL_DIR'       : UTIL_DIR,
    'STEMMER_DIR'    : STEMMER_DIR
  },
  consts : {
    'SINGLE_WORD'    : SINGLE_WORD,
    'WORD_LIST'      : WORD_LIST
  },
  content : {
    'exceptionContent' : require(CONTENT_DIR + 'exceptionContent')
  },
  modules : {
    'validations' : require(UTIL_DIR + 'validations'),
  },
  dict    : {
    'regexDict'   : require(LIB_DIR + 'regexDict')
  }
};

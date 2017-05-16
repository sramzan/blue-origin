// Configs for the global stem app

// Modules
var path = require('path');

// Consts
var ROOT_DIRECTORY = path.resolve(__dirname, '../../../src/'),
    SINGLE_WORD    = 'singleWord',
    WORD_LIST      = 'wordList';

// Export all configs
module.exports = {
  'paths' : {
    'ROOT_DIRECTORY' : ROOT_DIRECTORY
  },

  'consts' : {
    'SINGLE_WORD' : SINGLE_WORD,
    'WORD_LIST'   : WORD_LIST
  }
};

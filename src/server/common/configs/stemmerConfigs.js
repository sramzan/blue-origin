// Modules
var path = require('path');


// Dirs
var ROOT_DIRECTORY = path.resolve(__dirname, '../../../../src/'),
    LIB_DIR        = ROOT_DIRECTORY + '/server/lib/';

// Files
var regexDict = require(LIB_DIR + 'regexDict');

module.exports = {
  'modules' : {
    'regexDict' : regexDict
  },
  'paths'   : {
    'ROOT_DIRECTORY' : ROOT_DIRECTORY,
    'LIB_DIR'        : LIB_DIR
  }
};

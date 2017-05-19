// Configs for Stem Algorithm

// Modules
var path = require('path');


// Dirs
var ROOT_DIRECTORY = path.resolve(__dirname, '../../../../src/'),
    LIB_DIR        = ROOT_DIRECTORY + '/server/lib/';

// Files
var regexDict    = require(LIB_DIR + 'regexDict'),
    enExceptions = require(LIB_DIR + 'enExceptions');

// Export Configs
module.exports = {
  modules : {
    regexDict    : regexDict,
    enExceptions : enExceptions
  },
  paths   : {
    ROOT_DIRECTORY : ROOT_DIRECTORY,
    LIB_DIR        : LIB_DIR
  }
};

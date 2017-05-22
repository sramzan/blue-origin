// File level modules
var path              = require('path'),
    globalConfigs     = require(path.resolve(__dirname, '../common/configs/globalConfigs')),
    stemmerConfigs    = require(path.resolve(__dirname, '../common/configs/stemmerConfigs')),
    regexDict         = stemmerConfigs.modules.regexDict,
    enExceptions      = stemmerConfigs.modules.enExceptions,
    stemRules         = stemmerConfigs.modules.stemRuleMapper,
    exceptionMessages = globalConfigs.content.exceptionContent;

var stemEngine = function StemEngine(wordList, language){
  this.errorContentParams = {'name' : 'wordList',
                             'type' : typeof this.wordList,
                             'expectedType' : null};

  if(!Array.isArray(wordList)){
    throwConstructorError(this.errorContentParams);
  }

  this.wordList           = wordList;
  this.wordListLength     = wordList.length;
  this.invalidWordsInList = [];
  // this.stemRules      = stemRuleMapper.lookup(language); // TODO - Move logic to here to allow for future languages
};

function throwConstructorError(errorContentParams){
  errorContentParams.expectedType = 'Array';
  console.log(exceptionMessages.static.invalidWordListInput + '\n' + // TODO: Change to throw when done testing
              exceptionMessages.dynamic.notExpectedType(errorContentParams));
}
function isValidInput(input){
  return input !== null && input !== undefined;
}

stemEngine.prototype.test = function test(){
  console.log(this.wordList);
};

stemEngine.prototype.stemWordList = function(){
  return this.stemRules.decomposeAndStem(this.wordList); // This method must defined for all rule sets (it's the entry point)
};

module.exports.StemEngine = stemEngine;

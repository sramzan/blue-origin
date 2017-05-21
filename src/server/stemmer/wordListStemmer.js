// File level modules
var path              = require('path'),
    globalConfigs     = require(path.resolve(__dirname, '../common/configs/globalConfigs')),
    stemmerConfigs    = require(path.resolve(__dirname, '../common/configs/stemmerConfigs')),
    regexDict         = stemmerConfigs.modules.regexDict,
    enExceptions      = stemmerConfigs.modules.enExceptions,
    stemRules         = stemmerConfigs.modules.stemRuleMapper,
    exceptionMessages = globalConfigs.content.exceptionContent;

var stemEngine = function StemEngine(wordList, language){
  this.wordList       = wordList;
  this.wordListLength = wordList.length;
  this.errorContentParams = {'name' : 'wordList',
                             'type' : typeof this.wordList,
                             'expectedType' : null};
  // this.stemRules      = stemRuleMapper.lookup(language); // TODO - Move logic to here to allow for future languages
};

stemEngine.prototype.test = function test(){
  console.log(this.wordList);
};

stemEngine.prototype.stemWordList = function(){
  if (Array.isArray(this.wordList)){
    var index = 0,
        word  = '';
      for (; index < this.wordListLength; index++){
        word = this.wordListLength[index];
        if (validInput(word)){
          runRulesOn();
        }else{
          this.errorContentParam.expectedType = 'Number';
          console.log(exceptionMessages.static.invalidWord + '\n' + // TODO: Change to throw when done testing
                      exceptionMessages.dynamic.notExpectedType(errorContentParams));
        }
      }
  }else{
    this.errorContentParams.expectedType = 'Array';
    console.log(exceptionMessages.static.invalidWordListInput + '\n' + // TODO: Change to throw when done testing
                exceptionMessages.dynamic.notExpectedType(this.errorContentParams));
  }
};

module.exports.StemEngine = stemEngine;
// module.exports.test = test

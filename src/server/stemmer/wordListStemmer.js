// File level modules
var path              = require('path'),
    globalConfigs     = require(path.resolve(__dirname, '../common/configs/globalConfigs')),
    stemmerConfigs    = require(path.resolve(__dirname, '../common/configs/stemmerConfigs')),
    regexDict         = stemmerConfigs.modules.regexDict,
    enExceptions      = stemmerConfigs.modules.enExceptions,
    stemRuleMapper    = stemmerConfigs.languageStemRules,
    exceptionMessages = globalConfigs.content.exceptionContent;

var stemEngine = function StemEngine(wordList, language){
  if(!Array.isArray(wordList)){
    throwConstructorError(wordList, 'wordList', 'Array', 'invalidWordListInput');
  }

  if (!(typeof language === 'string')){
    throwConstructorError(language, 'language', 'string', 'invalidLanguage');
  }

  this.wordList           = wordList;
  this.wordListLength     = wordList.length;
  this.invalidWordsInList = [];
  this.stemRules          = stemRuleMapper[language];
};

function throwConstructorError(param, paramName, expectedType, staticLabel){ // TODO: Move this to error module
  errorContentParams = {'name'         : paramName,
                        'type'         : typeof language,
                        'value'        : param,
                        'expectedType' : expectedType
                       };
  var message = exceptionMessages.static[staticLabel] + '\n' +
                exceptionMessages.dynamic.notExpectedType(errorContentParams);
  console.log(message);
  throw new stemEngineError(message);
}

function stemEngineError(message){
  this.name    = "StemEngine Exception";
  this.message = message;
}

function isValidInput(input){
  return input !== null && input !== undefined;
}

stemEngine.prototype.test = function test(){
  console.log(this.wordList);
};

stemEngine.prototype.stemWordList = function(){
  console.log("Stemming List from Algo");
  return this.stemRules.decomposeAndStem(this.wordList); // This method must defined for all rule sets (it's the entry point)
};

module.exports.StemEngine = stemEngine;

// Test Code
// wordList   = ['apple', 'data', 'blastvark', 'banana', 'aardvark', 'aardwolf', 'aaron', 'enlighten', 'hey-there', 'oh-no-ye', 'seanp', 'zoomanh', 'szoop', '', null, undefined],
// wordList   = ['preface','face','walk','walking','fetch','bearable','enlighten', null, undefined, '', ' ', 'forcemeat', 'speedometer', 'force', 'meat', 'speed', 'meter', 'forcemeat', 'speedometer', 'force', 'meat', 'speed', 'meter'];
// wordList = ['forcemeat', 'speedometer', 'force', 'meat', 'speed', 'meter'];
// var wordList   = ['preface','face','walk','walking','fetch','bearable','enlighten', null, undefined, '', ' ', 'forcemeat', 'speedometer', 'force', 'meat', 'speed', 'meter', 'forcemeat', 'speedometer'];
// stemEngine = new stemEngine(wordList, 'en');
// results    = stemEngine.stemWordList();
// console.log(JSON.stringify(results));

// File level modules
var path            = require('path'),
    stemmerConfigs  = require(path.resolve(__dirname, '../common/configs/stemmerConfigs')),
    regexDict       = stemmerConfigs.modules.regexDict,
    enExceptions    = stemmerConfigs.modules.enExceptions,
    stemRules       = stemmerConfigs.modules.stemRuleMapper;

function StemEngine(wordList, language){
  this.wordList       = wordList;
  this.wordListLength = wordList.length;
  this.stemRules      = stemRuleMapper.lookup(language);
}

function test(){
  console.log(this.wordList);
}

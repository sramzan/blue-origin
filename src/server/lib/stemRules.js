var path    = require('path'),
    configs = require(path.resolve(__dirname, '../common/configs/stemmerConfigs'));

var ruleMapper = {
  'en' : configs.stemRuleModules.enStemRules
};

module.exports.lookup = function(language){
  if (ruleMapper.hasOwnProperty(language)){
    return ruleMapper[language];
  }else{
    return null;
  }
};

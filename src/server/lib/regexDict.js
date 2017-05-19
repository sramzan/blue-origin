// new RegExp(regexPattern);

var regexExpressions = {
  vowels     : /[aeiouy]/gi, // searches for all matches, and ignores case
  consonants : /[^aeiou]/gi,
  vowel      : "[aeiouy]", 
  consonant  : "[^aeiou]"
};

module.exports.lookup = function(key){
      return regexExpressions[key] || -1;
  };

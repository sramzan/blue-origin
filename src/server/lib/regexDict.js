// new RegExp(regexPattern);

var regexExpressions = {
  vowels     : /[aeiouy]/gi,
  consonants : "[^aeiou]",
}

module.exports.lookup = function(key){
      return regexExpressions[key] || -1;
  };

// new RegExp(regexPattern);

var regexExpressions = {
  vowels     : /[aeiouy]/gi, // searches for all matches, and ignores case
  consonants : /[^aeiou]/gi,
  vowel      : "[aeiouy]",
  consonant  : "[^aeiou]",
  anySpace   : /\s/gi,
  multipleDashes : /(-.*){2,}/gi,
  singleDash : "[-]"
};

module.exports.lookup = function(key){
      return regexExpressions[key] || -1;
  };

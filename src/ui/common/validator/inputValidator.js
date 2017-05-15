/*
  * @file Input Validator
*/

// Common Regex Patterns
var anyNonLetterCharsPattern = "(\\d)|(\\W+)|(_)", // catches digits, non alphanumeric chars, underscores
    urlFormatPattern="" // catches forms that do not align to 'http://url'

/*
  * @param {String} input - The input text provided by the user
  * @param {String} regexPattern - The regex expression that will be tested against the input
  * @returns {Boolean} True if the input contains an illegal character, false if not
*/
function matchesPattern(input, regexPattern){
  var pattern = new RegExp(regexPattern);
  return pattern.test(input);
}

function containsInvalidInput(input){
  return matchesPattern(input, anyNonLetterCharsPattern); // return false if it contains the illegal chars
}

function validatesURLInput(input){
  return matchesPattern(input, urlFormatPattern);
}

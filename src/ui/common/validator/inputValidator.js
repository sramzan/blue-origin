/*
  * @file Input Validator
  Credit For urlFormatPattern: http://stackoverflow.com/questions/30970068/js-regex-url-validation
*/

function ErrValidator(){

  // Common Regex Patterns
  var commonRegexPatterns = {
        'anyNonLetterCharsPattern' : "(\\d)|(\\W+-)|(_)", // catches digits, non alphanumeric chars, underscores
        'urlFormatPattern'         : "^(https?://)?(www\\.)?([-a-z0-9]{1,63}\\.)*?[a-z0-9][-a-z0-9]{0,61}[a-z0-9]\\.[a-z]{2,6}(/[-\\w@\\+\\.~#\\?&/=%]*)?$"                  // catches forms that do not align to 'http://url'
  };

  /*
    * @param {String} input - The input text provided by the user
    * @param {String} regexPattern - The regex expression that will be tested against the input
    * @returns {Boolean} True if the input contains an illegal character, false if not
  */
  this.matchesPattern = function(input, regexPattern){
    var pattern = new RegExp(regexPattern);
    return pattern.test(input);
  };

  /*
    * Function will default to RegExp default behavior when created with a regex of "" if regex is not passed
    * @param {String} input - The input text provided by the user
    * @param {String} regexLookup - Could use commonly used regex expression defined in validator, or pass in custom regex
    * @returns {Boolean} True if the input contains an illegal character, false if not
  */
  this.containsInvalidInput = function(input, regexLookup){
    var regex = regexLookup || "";
    regex = commonRegexPatterns[regex] || regex;
    return this.matchesPattern(input, regex); // return false if it contains the illegal chars
  };

}

/*
  function will return:
    { word : {
        'stem'    : arr[stems],
        'affixes' : arr[affixes]
      }
    }

  returns { word : {} } if there is no matching format (i.e. does not fit format defined in problem statement)
*/

/*
  * Formatted for english words constructed with letters 'a'-'z' inclusive
  * Every syllable in every word MUST have a vowel
  * To find # of syllables
    - count vowels in word
    - subtract any silent vowels
      - when a syllable ends in a silent 'e', the silent 'e' is a signal that the vowel in front of it is long
    - Subtract one vowel from every diphthong
      - diphthong = two adjacent vowels within the same syllable
      - i.e. oi,oy,ou,ow,au,aw,oo

      An affix can be multiple syllables long
      The focus marker -um- is a infix which is added after the first consonant of the root.
      Prefix is the thing attached to the root of the word
      Suffix is the thing attached to the end of the root
        - Could try to find route, otherwise find the affixes first
*/
var path         = require('path'),
    configs      = require(path.resolve(__dirname, '../configs/stemmerConfigs')),
    regexDict    = configs.modules.regexDict,
    enExceptions = configs.modules.enExceptions;

function isEven(num){
  return (num % 2) === 0;
}

function isOdd(num){
  return Math.abs(num % 2) === 1;
}

function containsDoubleMiddleConsonant(word, middle){
  var consonantPattern = new RegExp(regexDict.lookup('consonant')),
      vowelPattern     = new RegExp(regexDict.lookup('vowel'));
  return consonantPattern.test(word.charAt(middle))   &&
         consonantPattern.test(word.charAt(middle-1)) &&
         vowelPattern.test(word.charAt(middle+1))     &&
         vowelPattern.test(word.charAt(middle-2))     &&
         !(enExceptions.digraphs[word.charAt(middle-1)+word.charAt(middle)]); // Making sure the two consonants are not a digraph
}

function divideDoubleConsonant(word){
  if (word.length >= 4){ // Rule doesn't apply to words shorter than 4 chars (vccv) where v = vowel, c = consonant
    var middle = (word.length / 2);
    if (isOdd(word.length)){
      middle += 1; // offset middle to the higher index
    }
    if(containsDoubleMiddleConsonant(word, middle)){
      var splitSyllables = [word.substring(0,middle), word.substring(middle)];
      return splitSyllables;
    }
  }
  return word;
}

function breakUpWordBySyllable(word) {
  // Divide middle consonants

}

function checkForPrefix(word){

}

function getNumVowels(word){
  return word.match(regexDict.lookup('vowels')).length;
}

function getNumberOfSyllables(word){
  // 1
  var numVowels = getNumVowels(word);

}

exports.stemWord = function(word){
  var numOfSyllablesInWord = getNumberOfSyllables(word);

  // Default payload
  var stems   = [],
      affixes = [],
      deconstructedWordPayload = {
        'word'    : word,
        'stems'   : stems,
        'affixes' : affixes
      };

  if (numOfSyllablesInWord > 1){ // Only care about words with 2 or more syllables, otherwise we assume the word passed is the root word
    if (numOfSyllablesInWord > 3){ // All forms for our problem state a pattern of 3 except for a form with all stems, which can have n stems
      deconstructedWordPayload.stems = breakUpWordBySyllable(word);
      return deconstructedWordPayload;

      // Infix - check if two syllables are joined by a single vowel or consonant. This is an infix? - Think about this

      // Circumfix - check if first & last syllables are the same, if so this is a Circumfix setup
      var context = {};
      checkForPrefix(word);
    }
  return deconstructedWordPayload;
  }
};

console.log(divideDoubleConsonant('basket'));

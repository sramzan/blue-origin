/*

TODO: Delete

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
        technically, a suffix is a syllable (one sound) added to the end of a word to change its meaning or give it grammatical function. a prefix is just the opposite. a prefix can be one or more syllables added to the beginning of a word to change it's meaning.
*/

// File Level modules
var path         = require('path'),
    configs      = require(path.resolve(__dirname, '../configs/stemmerConfigs')),
    regexDict    = configs.modules.regexDict,
    enExceptions = configs.modules.enExceptions;

function StemEngine(wordList, language){
  this.wordList       = wordList;
  this.wordListLength = wordList.length;
  this.stemRules      = stemRules.lookup(language);
}

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

exports.stemWord = function(wordList){

  // Default payload
  var stems          = [],
      affixes        = [],
      currentIndex   = 0,
      wordListLength = wordList.length,
      deconstructedWordPayload = {
        'word'    : word,
        'stems'   : stems,
        'affixes' : affixes
      };

  wordList.sort(); // TODO: Replace with trie implementation so that we could more effectively sort the deconstructed words (also helps finding prefixes)
  for (; currentIndex < wordList.length; currentIndex++){
    var word = wordList[currentIndex];

    if (index+1 === wordListLength){ // get rid of this

    }
    if (word.length > 3){ // Only care about words with 2 or more syllables, otherwise we assume the word passed is the root word
      // Check for circumfix
      runStemRules()
    }
  }
  return deconstructedWordPayload;
  }
};

console.log(divideDoubleConsonant('basket'));

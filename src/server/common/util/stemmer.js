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
  * Every syllable in every word MUST have a vowel
  * To find # of syllables
    - count vowels in word
    - subtract any silent vowels
      - when a syllable ends in a silent 'e', the silent 'e' is a signal that the vowel in front of it is long
    - Subtract one vowel from every diphthong
      - diphthong = two adjacent vowels within the same syllable
      - i.e. oi,oy,ou,ow,au,aw,oo
*/
var path      = require('path'),
    configs   = require(path.resolve(__dirname, '../configs/stemmerConfigs')),
    regexDict = configs.modules.regexDict;


var vowels = ['a', 'e', 'i', 'o', 'u']; // make obj instead?

function checkForPrefix(word){

};

function getNumVowels(word){
  return word.match(regexDict.lookup('vowels')).length;
}

function getNumberOfSyllables(word){
  // 1
  var numVowels = getNumVowels(word);
}

exports.stemWord = function(word){
  if (word.length > 2){ // Only care to stem words lf length 3 or greater
    var context = {};
    getNumberOfSyllables(word);
    checkForPrefix(word);
  }
  return { word : {} }
}

console.log(getNumVowels('sean'));

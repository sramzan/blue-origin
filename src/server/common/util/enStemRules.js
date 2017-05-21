function reverseString(str){ // TODO: Move these to a util
  return str.split('').reverse().join('');
}

function areEqual(str1, str2){
  return str1 === str2;
}

function isValidInput(input){
  return input !== null && input !== undefined;
}

// end move

function circumfixAffixPatternCheck(word){
  var frontIndex      = 0,
      backIndex       = word.length - 1,
      frontExpression = '',
      backExpression  = '',
      results         = {
                          'matches' : false,
                          'affixes' : {},
                          'stems'   : []
                        };
  for (; frontIndex <= backIndex; frontIndex++,backIndex-- ){
    frontExpression = frontExpression + word.charAt(frontIndex);
    backExpression  = backExpression  + word.charAt(backIndex);
    if(areEqual(frontExpression, reverseString(backExpression))){
        if ((frontIndex < backIndex) && ((frontIndex + 1) !== backIndex)){
        results.matches = true;
        results.affixes = {'circumfix' : [word.substring(0, frontIndex+1)]}; // TODO: Make circumfix a global config
        results.stems   = [word.substring(frontIndex+1, backIndex)];
      }
    }
  }
  return results;
}

function prefixPattern(wordList, currentIndex){
  if (currentIndex+1 >= wordList.length){
    // Need to figure out what to do
  }
  var currentIndex = 0,
      word1        = wordList[currentIndex],
      word1Length  = word1.length,
      word2        = wordList[currentIndex+1],
      expr1        = '',
      expr2        = '',
      results      = {
                       'matches' : false,
                       'affixes' : [],
                       'stem'   : []
                     };
  if (isValidInput(word2) && word2Length > 3){

  }else{
    return results;
  }
  for (; currentIndex < listLength; currentIndex++){

  }

}

function generateAnalyzedWordObj(word, stems, affixes){
  var typesOfAffixes = ['prefix', 'suffixes', 'circumfix', 'infix'],
      analyzedWordObj = {
    'word'    : word,
    'stems'   : stems,
    'affixes' : {
      'prefix'    : [],
      'suffixes'  : [],
      'circumfix' : [],
      'infix'     : []
    }
  };

  typesOfAffixes.forEach(function(affixType){
    if (affixes.hasOwnProperty(affixType) && Array.isArray(affixes[affixType]) && affixes[affixType].length > 0){
      analyzedWordObj.affixes[affixType] = affixes[affixType];
    }
  }, this);

  return analyzedWordObj;
}

function buildPrefixesAndSuffixes(wordList){
  wordList = wordList.sort();
  var prefixDict   = {},
      suffixDict   = {},
      currentIndex = 0,
      currentCharIndex = 0,
      listLength   = wordList.length,
      word1        = '',
      word2        = '',
      expr1        = '',
      expr2        = '',
      hasPrefix    = false,
      analyzedWords = {}; // word : {word: word, stems : [], affixes : []}

  for (; currentIndex < listLength; currentIndex++){
    currentCharIndex = 0;
    expr1 = '';
    expr2 = '';
    word1 = wordList[currentIndex];
    word2 = (currentIndex + 1) < listLength ? wordList[currentIndex+1] : ""; // Check for when word1 is the last word in the array

    if (isValidInput(word1)){
      // Do not analye duplicate word
      if (analyzedWords.hasOwnProperty(word1)){
        continue;
      }

      // Check for circumfix pattern
      var circumfixPattern = circumfixAffixPatternCheck(word1);
      if (circumfixPattern.matches){
        analyzedWords[word1] = generateAnalyzedWordObj(word1, circumfixPattern.stems, circumfixPattern.affixes);
        continue;
      }

      // Prefix check
      var currentPrefix = [];
      for (; currentCharIndex < word1.length; currentCharIndex++){
        expr1 = expr1 + word1.charAt(currentCharIndex);
        expr2 = expr2 + word2.charAt(currentCharIndex);
        if (prefixDict.hasOwnProperty(expr1) || areEqual(expr1, expr2)){ // Check if the prefix has already been found
          currentPrefix = [expr1];
          if (!prefixDict.hasOwnProperty(expr1)){ // If new prefix found, add it to the dict
              prefixDict[expr1] = true;
          }
          continue;
        }else{
          break;
        }
      }
      analyzedWords[word1] = generateAnalyzedWordObj(word1, [], {'prefix' : currentPrefix});

      // Suffix Check
    }
  }

  return analyzedWords;


}

console.log(JSON.stringify(buildPrefixesAndSuffixes(['apple', 'banana', 'aardvark', 'aardwolf', 'aaron', 'enlighten'])));
// console.log(buildPrefixesAndSuffixes(['apple', 'banana', 'aardvark', 'aardwolf', 'aaron', 'aback']));

// module.exports = {
//
// };

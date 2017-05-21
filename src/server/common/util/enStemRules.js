function reverseString(str){ // TODO: Move these to a util
  return str.split('').reverse().join('');
}

function areEqual(str1, str2){
  return str1 === str2;
}

function cleanUp(input){
  return input.trim().toLowerCase();
}
//
// function containSpace(input){
//   return
// }

function isValidInput(input){
  return input !== null && input !== undefined && input.trim() !== ''; //&& !containsSpace(input);
}

// end move

var prefixDict   = {},
    suffixDict   = {},
    analyzedWords = {}; // word : {word: word, stems : [], affixes : []}

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

function prefixPatternCheck(word1, word2){
  var currentCharIndex = 0,
      expr1 = '',
      expr2 = '',
      currentPrefix = [],
      results = {
        'matches' : false,
        'prefix'  : null
      };
  for (; currentCharIndex < word1.length; currentCharIndex++){
    expr1 = expr1 + word1.charAt(currentCharIndex);
    expr2 = expr2 + word2.charAt(currentCharIndex);
    if (prefixDict.hasOwnProperty(expr1) || areEqual(expr1, expr2)){ // Check if the prefix has already been found
      results.prefix = [expr1];
      if (!prefixDict.hasOwnProperty(expr1)){ // If new prefix found, add it to the dict
          prefixDict[expr1] = true;
      }
      continue;
    }else{
      break;
    }
  }

  if(results.prefix && results.prefix.length > 0){
    results.matches = true;
  }

  return results;
}


// function prefixPattern(wordList, currentIndex){
//   if (currentIndex+1 >= wordList.length){
//     // Need to figure out what to do
//   }
//   var currentIndex = 0,
//       word1        = wordList[currentIndex],
//       word1Length  = word1.length,
//       word2        = wordList[currentIndex+1],
//       expr1        = '',
//       expr2        = '',
//       results      = {
//                        'matches' : false,
//                        'affixes' : [],
//                        'stem'   : []
//                      };
//   if (isValidInput(word2) && word2Length > 3){
//
//   }else{
//     return results;
//   }
//   for (; currentIndex < listLength; currentIndex++){
//
//   }
//
// }

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
  var reversedWordList = wordList.map(function(str){
    if(isValidInput(str)){
      return reverseString(str);
    }
  });
  reversedWordList = reversedWordList.sort();
  var currentIndex = 0,
      backIndex    = 0,
      listLength   = wordList.length,
      word1        = '',
      word2        = '',
      hasPrefix    = false;

  for (; currentIndex < listLength; currentIndex++){
    word1 = wordList[currentIndex];
    word2 = (currentIndex + 1) < listLength ? wordList[currentIndex+1] : ""; // Check for when word1 is the last word in the array

    if (isValidInput(word1)){
      word1 = cleanUp(word1);
      word2 = isValidInput(word2) ? cleanUp(word2) : "";
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
      var prefixPattern = prefixPatternCheck(word1, word2);
      if (prefixPattern.matches){
        hasPrefix = true;
      }

      // Suffix Check
      var currentReversedIndex = 0,
          reversedLength = reversedWordList.length,
          currentCharIndex = 0,
          expr1 = '',
          expr2 = '',
          reversedWord1 = reverseString(word1),
          indexOfReversedWord2 = reversedWordList.indexOf(reversedWord1) + 1;
          reversedWord2 = indexOfReversedWord2 < listLength ? reversedWordList[indexOfReversedWord2] : '',
          currentSuffix = { 'suffix' : [] };
      if (isValidInput(reversedWord1)){
        reversedWord1 = cleanUp(reversedWord1);
        reversedWord2 = isValidInput(reversedWord2) ? cleanUp(reversedWord2) : '';

        for(; currentCharIndex < reversedWord1.length; currentCharIndex++){
          expr1 = expr1 + reversedWord1.charAt(currentCharIndex);
          expr2 = expr2 + reversedWord2.charAt(currentCharIndex);
          if (suffixDict.hasOwnProperty(expr1) || areEqual(expr1, expr2)){ // Check if the prefix has already been found
            currentSuffix.suffix = [reverseString(expr1)];
            if (!suffixDict.hasOwnProperty(expr1)){ // If new prefix found, add it to the dict
                suffixDict[expr1] = true;
            }
            continue;
          }else{
            break;
          }
          // if(currentPrefix.length > 0){
          //   results.matches = true;
          //   results.prefix  = currentPrefix;
          // }
        }
      }

      // get stems
      var stem = word1;

      if (prefixPattern.prefix && prefixPattern.prefix.length > 0){
        stem = stem.replace(prefixPattern.prefix[0], '');
        // stem = stem.substring(stem.length - prefixPattern.prefix.length);
      }

      if (currentSuffix.suffix && currentSuffix.suffix.length > 0){
        // stem = word1.replace(currentSuffix.suffix[0], '');
        stem = stem.substring(0, (stem.length - currentSuffix.suffix[0].length));
      }

      if (currentSuffix.suffix.length > 0){
        analyzedWords[word1] = generateAnalyzedWordObj(word1, [stem], {'suffixes' : currentSuffix.suffix,
                                                                    'prefix'  : prefixPattern.prefix});
      }

      // Suffix Check
    }
  }

  return analyzedWords;


}

console.log(JSON.stringify(buildPrefixesAndSuffixes(['apple', 'data', 'blastvark', 'banana', 'aardvark', 'aardwolf', 'aaron', 'enlighten', '', null, undefined])));
// console.log(buildPrefixesAndSuffixes(['apple', 'banana', 'aardvark', 'aardwolf', 'aaron', 'aback']));

// module.exports = {
//
// };

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

var prefixDict    = {},
    suffixDict    = {},
    analyzedWords = {}; // word : {word: word, stems : [], affixes : []}

function circumfixAffixPatternCheck(word){
  var frontIndex      = 0,
      backIndex       = word.length - 1,
      frontExpression = '',
      backExpression  = '',
      results         = {
                          'matched' : false,
                          'affixes' : {},
                          'stems'   : []
                        };
  for (; frontIndex <= backIndex; frontIndex++,backIndex-- ){
    frontExpression = frontExpression + word.charAt(frontIndex);
    backExpression  = backExpression  + word.charAt(backIndex);
    if(areEqual(frontExpression, reverseString(backExpression))){
        if ((frontIndex < backIndex) && ((frontIndex + 1) !== backIndex)){
        results.matched = true;
        results.affixes = {'circumfix' : [word.substring(0, frontIndex+1)]}; // TODO: Make circumfix a global config
        results.stems   = [word.substring(frontIndex+1, backIndex)];
      }
    }
  }
  return results;
}

function checkIfPatternExists(word1, word2, dict, type){
  var expr1 = '',
      expr2 = '',
      currentCharIndex = 0,
      results = { 'matched' : false, };
  results[type] = [];

  for (; currentCharIndex < word1.length; currentCharIndex++){
    expr1 = expr1 + word1.charAt(currentCharIndex);
    expr2 = expr2 + word2.charAt(currentCharIndex);
    if (dict.hasOwnProperty(expr1) || areEqual(expr1, expr2)){ // Check if the prefix has already been found
      results[type] = (type === 'suffixes') ? [reverseString(expr1)] : [expr1];
      if (!dict.hasOwnProperty(expr1)){ // If new prefix found, add it to the dict
          dict[expr1] = true;
      }
      continue;
    }else{
      break;
    }
  }

  return results;
}

function prefixPatternCheck(word1, word2){
  var results = checkIfPatternExists(word1, word2, prefixDict, 'prefix');

  if(results.prefix && results.prefix.length > 0){
    results.matched = true;
  }
  return results;
}

function suffixPatternCheck(word1, word2, reversedWordList){
  var listLength           = reversedWordList.length,
      reversedWord1        = reverseString(word1),
      indexOfReversedWord2 = reversedWordList.indexOf(reversedWord1) + 1;
      reversedWord2        = indexOfReversedWord2 < listLength ? reversedWordList[indexOfReversedWord2] : '',
      results              = {};

  if (isValidInput(reversedWord1)){
    reversedWord1 = cleanUp(reversedWord1);
    reversedWord2 = isValidInput(reversedWord2) ? cleanUp(reversedWord2) : '';
    results = checkIfPatternExists(reversedWord1, reversedWord2, suffixDict, 'suffixes');
  }

  if(results.suffixes && results.suffixes.length > 0){
    results.matched = true;
  }
  return results;
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

function checkForValidInputAndReverse(str){
  if(isValidInput(str)){
    return reverseString(str);
  }
}

function decomposeAndStem(wordList){
  var currentIndex = 0,
      backIndex    = 0,
      listLength   = wordList.length,
      word1        = '',
      word2        = '',
      hasPrefix    = false;
  wordList             = wordList.sort();
  var reversedWordList = wordList.map(checkForValidInputAndReverse);
  reversedWordList     = reversedWordList.sort();

  for (; currentIndex < listLength; currentIndex++){
    hasPrefix = false;
    hasSuffix = false;
    word1 = wordList[currentIndex];
    word2 = (currentIndex + 1) < listLength ? wordList[currentIndex+1] : ""; // Check for when word1 is the last word in the array
    if (isValidInput(word1)){
      if (word1.length < 3){
        analyzedWords[word1] = generateAnalyzedWordObj(word1, [word1], {});
      }
      word1 = cleanUp(word1);
      word2 = isValidInput(word2) ? cleanUp(word2) : "";
      // Do not analye duplicate word
      if (analyzedWords.hasOwnProperty(word1)){
        continue;
      }

      // Check for circumfix pattern
      var circumfixPattern = circumfixAffixPatternCheck(word1);
      if (circumfixPattern.matched){
        analyzedWords[word1] = generateAnalyzedWordObj(word1, circumfixPattern.stems, circumfixPattern.affixes);
        continue;
      }

      // Prefix check
      var prefixCheckResults = prefixPatternCheck(word1, word2);
      if (prefixCheckResults.matched){
        hasPrefix = true;
      }

      // Suffix Check
      var suffixCheckResults = suffixPatternCheck(word1, word2, reversedWordList);
      if (suffixCheckResults.matched){
        hasSuffix = true;
      }

      // Get stems based on prefix & suffix check
      var stem = word1;
      if (hasPrefix){
        stem = stem.replace(prefixCheckResults.prefix[0], '');
        // stem = stem.substring(stem.length - prefixCheckResults.prefix.length);
      }

      if (hasSuffix){
        // stem = word1.replace(currentSuffix.suffix[0], '');
        stem = stem.substring(0, (stem.length - suffixCheckResults.suffixes[0].length));
      }

        analyzedWords[word1] = generateAnalyzedWordObj(word1, [stem], {'suffixes' : suffixCheckResults.suffixes,
                                                                       'prefix'   : prefixCheckResults.prefix});
    }else{
      this.errorContentParam.expectedType = 'Number'; //TODO: Move this error throwing logic to new module
      console.log(exceptionMessages.static.invalidWord + '\n' + // TODO: Change to throw when done testing
                  exceptionMessages.dynamic.notExpectedType(errorContentParams));
    }
  }

  return analyzedWords;
}

// Test Case - leaving one for an example
// console.log(JSON.stringify(decomposeAndStem(['apple', 'data', 'blastvark', 'banana', 'aardvark', 'aardwolf', 'aaron', 'enlighten', '', null, undefined])));

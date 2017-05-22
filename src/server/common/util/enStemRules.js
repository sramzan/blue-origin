var path              = require('path'),
    globalConfigs     = require(path.resolve(__dirname, '../configs/globalConfigs')),
    exceptionMessages = globalConfigs.content.exceptionContent,
    regexDict        = globalConfigs.dict.regexDict,
    commonUtil        = new globalConfigs.modules.validations.Validations(),
    prefixDict        = {},
    suffixDict        = {},
    stemDict          = {},
    analyzedWords     = {}, // word : {word: word, stems : [], affixes : []}
    INFIX             = 'infix',
    SUFFIXES          = 'suffixes',
    PREFIX            = 'prefix',
    CIRCUMFIX         = 'circumfix';

function setResultsObjToMatched(results, stems, affixes, affixType){ // TODO: Refactor logic to call this, and reduce some of the redudant logic below
  results.matched            = true;
  results.stems              = stems;
  results.affixes[affixType] = affixes;
}

function infixPatternCheck(word){
  var results = {
        'matched' : false,
        'affixes' : {},
        'stems'   : []
      },
      singleDashPattern = new RegExp(regexDict.lookup('singleDash'));

  if (singleDashPattern.test(word)){
    setResultsObjToMatched(results, word.split('-'), ['-'], INFIX);
  }
  return results;
}


function circumfixAffixPatternCheck(word){ // TODO: Align results obj to the uniform return of the other patterns
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
    if(commonUtil.areEqual(frontExpression, commonUtil.reverseString(backExpression))){
        if ((frontIndex < backIndex) && ((frontIndex + 1) !== backIndex)){
        results.matched = true;
        results.affixes = {CIRCUMFIX : [word.substring(0, frontIndex+1)]}; // TODO: Make circumfix a global config
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
    if (dict.hasOwnProperty(expr1) || commonUtil.areEqual(expr1, expr2)){ // Check if the prefix has already been found
      results[type] = (type === SUFFIXES) ? [commonUtil.reverseString(expr1)] : [expr1];
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
  var results = checkIfPatternExists(word1, word2, prefixDict, PREFIX);

  if(results.prefix && results.prefix.length > 0){
    results.matched = true;
  }
  return results;
}

function suffixPatternCheck(word1, word2, reversedWordList){
  var listLength           = reversedWordList.length,
      reversedWord1        = commonUtil.reverseString(word1),
      indexOfReversedWord2 = reversedWordList.indexOf(reversedWord1) + 1;
      reversedWord2        = indexOfReversedWord2 < listLength ? reversedWordList[indexOfReversedWord2] : '',
      results              = {};

  if (commonUtil.isValidInput(reversedWord1)){
    reversedWord1 = commonUtil.cleanUp(reversedWord1);
    reversedWord2 = commonUtil.isValidInput(reversedWord2) ? commonUtil.cleanUp(reversedWord2) : '';
    results = checkIfPatternExists(reversedWord1, reversedWord2, suffixDict, SUFFIXES);
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
  if(commonUtil.isValidInput(str)){
    return commonUtil.reverseString(str);
  }
}

module.exports.decomposeAndStem = function(wordList){
  var currentIndex = 0,
      backIndex    = 0,
      listLength   = wordList.length,
      word1        = '',
      word2        = '',
      hasPrefix    = false;
  wordList             = wordList.sort();
  var reversedWordList = wordList.map(checkForValidInputAndReverse);
  reversedWordList     = reversedWordList.sort();
  console.log(1);
  for (; currentIndex < listLength; currentIndex++){
    hasPrefix = false;
    hasSuffix = false;
    word1 = wordList[currentIndex];
    word2 = (currentIndex + 1) < listLength ? wordList[currentIndex+1] : ""; // Check for when word1 is the last word in the array
    if (commonUtil.isValidInput(word1) && !word1.match(regexDict.lookup('multipleDashes'))){
      if (word1.length < 3){
        analyzedWords[word1] = generateAnalyzedWordObj(word1, [word1], {});
      }
      word1 = commonUtil.cleanUp(word1);
      word2 = commonUtil.isValidInput(word2) ? commonUtil.cleanUp(word2) : "";

      // Do not analye duplicate word
      if (analyzedWords.hasOwnProperty(word1)){
        continue;
      }

      var infixPattern = infixPatternCheck(word1);
      if (infixPattern.matched){
        analyzedWords[word1] = generateAnalyzedWordObj(word1, infixPattern.stems, infixPattern.affixes);
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

      // No Prefix, Suffix, or Circumfix found, so store the stem & the word
      // if (commonUtil.areEqual(stem, word1)){
      //
      // }

        analyzedWords[word1] = generateAnalyzedWordObj(word1, [stem], {'suffixes' : suffixCheckResults.suffixes,
                                                                       'prefix'   : prefixCheckResults.prefix});
        console.log('ANALYZED WORDS : ' + analyzedWords);
    }else{
      var errorContentParams = {
            expectedType : 'String', //TODO: Move this error throwing logic to new module
            name         : 'word1',
            type         : typeof word1,
            value        : word1
      };
      console.log(exceptionMessages.static.invalidWord + '\n' + // TODO: Change to throw when done testing
                  exceptionMessages.dynamic.notExpectedType(errorContentParams));
    }
  }

  return analyzedWords;
};

// Test Case - leaving one for an example
// console.log(JSON.stringify(decomposeAndStem(['apple', 'data', 'blastvark', 'banana', 'aardvark', 'aardwolf', 'aaron', 'enlighten', '', null, undefined])));

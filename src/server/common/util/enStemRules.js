var path              = require('path'),
    globalConfigs     = require(path.resolve(__dirname, '../configs/globalConfigs')),
    exceptionMessages = globalConfigs.content.exceptionContent,
    regexDict        = globalConfigs.dict.regexDict,
    commonUtil        = new globalConfigs.modules.validations.Validations(),
    prefixDict        = {},
    suffixDict        = {},
    stemDict          = {},
    analyzedWords     = {}, // word : {word: word, stems : [], affixes : []}
    exploredWords     = {},
    wordWeb           = {},
    wordCount         = {},
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

function processRemainingWords(remainingWordList){
  var index       = 0,
      charIndex   = 0,
      word1 = '',
      currentSubstr = '',
      expr2 = '',
      listOfStems = [],
      currentStem = '';

  remainingWordList = remainingWordList.sort();

  for(; index < remainingWordList.length; index++){
    currentSubstr = '';
    charIndex     = 0;
    word1 = remainingWordList[index];
    word2 = (index + 1) < remainingWordList.length ? remainingWordList[index+1] : '';
    for (; charIndex < word1.length; charIndex++){
      currentSubstr = currentSubstr + word1.charAt(charIndex);
      // Compare the two words first, and then go to the dict. This is so that we don't miss out on new stems that may be embedded within one another
      if (word2.includes(currentSubstr)){ // If the current expression is anywhere in the second word, it must be a stem, and we're going to store it
        currentStem = currentSubstr;
      }else{
        if (currentStem !== ''){ // If something was found in the adjacent word, add it to the record books
          listOfStems.push(currentStem);
          currentSubstr = '';
        }else if(stemDict.hasOwnProperty(currentSubstr)){ // If the adjacent word has nothing related to word1, we will look to our hand-dandy dict for answers
          listOfStems.push(currentSubstr);
          currentSubstr = '';
        }
      }
    }
    if (currentSubstr !== ''){ // There was a part of, or the entire word, that could not be matched
      listOfStems.push(currentSubstr);
      stemDict[currentSubstr] = true; // Add new stem found
    }
    analyzedWords[word1] = generateAnalyzedWordObj(word1, listOfStems, {'suffixes' : [],
                                                                         'prefix'   : []});
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

function checkForValidInputAndReverse(str){
  if(commonUtil.isValidInput(str)){
    return commonUtil.reverseString(str);
  }
}

function checkIfWordIsPartOfAnotherWord(wordBeingSearch, wordList, start){
  var index       = 0,
      currentWord = '',
      matchFound  = false;

  if (!wordWeb.hasOwnProperty(wordBeingSearch)){
    wordWeb[wordBeingSearch] = [];
  }

  for(; index < wordList.length; index++){
    currentWord = wordList[index];
    if (currentWord.includes(wordBeingSearch) && currentWord !== wordBeingSearch){
      if (wordWeb.hasOwnProperty(currentWord)){
        wordWeb[currentWord].forEach(function(complexWord){
          wordWeb[wordBeingSearch].push(complexWord);
        });
        delete wordWeb[currentWord];
    }
      wordWeb[wordBeingSearch].push(currentWord);
      wordCount[currentWord] = ++wordCount[currentWord] || 1; // Either it's the first time the word has matched something, or it has matched words before
      // TODO - Might want to store metadata associated with repeat seen word here
      matchFound = true;
    }
  }
  return matchFound;
}

module.exports.decomposeAndStem = function(wordList){
  var currentIndex = 0,
      backIndex    = 0,
      listLength   = wordList.length,
      currentWord  = '',
      word2        = '',
      hasPrefix    = false,
      wordsWithMultipleOrSingleStem = [];

  for(; currentIndex < listLength; currentIndex++){
    currentWord = wordList[currentIndex];
    checkIfWordIsPartOfAnotherWord(currentWord, wordList, currentIndex);
  }


  return analyzedWords;
};

// Test Case - leaving one for an example
// console.log(JSON.stringify(decomposeAndStem(['apple', 'data', 'blastvark', 'banana', 'aardvark', 'aardwolf', 'aaron', 'enlighten', '', null, undefined])));

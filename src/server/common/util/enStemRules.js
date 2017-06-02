var path              = require('path'),
    globalConfigs     = require(path.resolve(__dirname, '../configs/globalConfigs')),
    utils             = require(path.resolve(__dirname, './utils')),
    exceptionMessages = globalConfigs.content.exceptionContent,
    check             = new utils.validator.Validations(),
    helper            = new utils.helpers.Helpers(),
    analyzedWords     = {}, // word : {word: word, stems : [], affixes : {affix : []}}
    stemDict          = {},
    wordMetaData      = {},
    EMPTY_STRING      = globalConfigs.EMPTY_STRING;

// File Level Utility Methods
function addWordToStemDict(key, val){
  stemDict[key].push(val);
}

function init(){ // Ensures objs are reset each time these rules are used
  analyzedWords     = {},
  stemDict          = {},
  wordMetaData      = {};
}

function transferComplexWordsMapping(stem, oldStem){
  stemDict[oldStem].forEach(function(complexWord){
    stemDict[stem].push(complexWord);
    if (wordMetaData.hasOwnProperty(complexWord)){
      // reset meta data since the supposed stem has now changed
      --wordMetaData[complexWord].numOfStems;
      wordMetaData[complexWord].stems.splice(wordMetaData[complexWord].stems.indexOf(oldStem), 1);
    }
  });
  delete stemDict[oldStem];
}

function storeWordMetaData(wordBeingAnalyzed, currentWord){
  wordMetaData[currentWord] = wordMetaData[currentWord] || {};
  wordMetaData[currentWord].numOfStems = ++wordMetaData[currentWord].numOfStems || 1; // Either it's the first time the word has matched something, or it has matched words before
  if (wordMetaData[currentWord].numOfStems > 1){
    wordMetaData[currentWord].stems.push(wordBeingAnalyzed); // to get here, the word had to have contained one or more stems
  }else{
    wordMetaData[currentWord].stems = [wordBeingAnalyzed];
  }
}

function checkForMultipleStemsAndInfix(stem, word){
  var infix = '',
      storedWord = word;
  wordMetaData[word].stems.forEach(function(stem){
    if (word.includes(stem)){
      word = word.replace(stem, '');
    }
  });
  var infixObj = (word.trim().length > 0) ? {'infix' : [word]} : {};
  analyzedWords[storedWord] = generateAnalyzedWordObj(storedWord, wordMetaData[storedWord].stems, infixObj); // TODO - clean this up
}

function checkForPrefixAndSuffix(stem, word){
  var prefixSuffixObj = {},
      prefix          = '',
      suffix          = '',
      hasPrefix       = false,
      hasSuffx        = false;
  // Check for prefix
  if (word.includes(stem) && word.indexOf(stem) > 0){
    hasPrefix = true;
    prefix = word.substring(0, word.indexOf(stem));
    prefixSuffixObj.prefix = [prefix];
  }

  // Check for suffix
  var charPosAfterEndOfStem = word.indexOf(stem) + stem.length;
  if(word.includes(stem) && word.charAt(charPosAfterEndOfStem) !== EMPTY_STRING){
    hasSuffx = true;
    suffix   = word.substring(charPosAfterEndOfStem, word.length);
    prefixSuffixObj.suffix = [suffix];
  }

  if (hasPrefix || hasSuffx){
    analyzedWords[word] = generateAnalyzedWordObj(word, stem, prefixSuffixObj);
  }
}

function generateAnalyzedWordObj(word, stems, affixes){
  var typesOfAffixes = ['prefix', 'suffix', 'circumfix', 'infix'],
      analyzedWordObj = {
    'word'    : word,
    'stems'   : stems,
    'affixes' : {
      'prefix'    : [],
      'suffix'    : [],
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

// Stemmer Logic
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
    if(check.areEqual(frontExpression, helper.reverseString(backExpression))){
        if ((frontIndex < backIndex) && ((frontIndex + 1) !== backIndex)){
        results.matched = true;
        results.affixes = {'circumfix' : [word.substring(0, frontIndex+1)]}; // TODO: Make circumfix a global config
        results.stems   = [word.substring(frontIndex+1, backIndex)];
      }
    }
  }
  return results;
}

function updateStemDict(wordBeingAnalyzed, wordList){
  var index       = 0,
      currentWord = '',
      matchFound  = false;

  if (!stemDict.hasOwnProperty(wordBeingAnalyzed) && !wordMetaData.hasOwnProperty(wordBeingAnalyzed)){ // The word has not been seen yet, so assume it's a stem
    stemDict[wordBeingAnalyzed] = [];
  }

  for(; index < wordList.length; index++){
    currentWord = wordList[index];
    if (check.isValidInput(currentWord)){ // TODO: Refactor into something more elegant
      currentWord = helper.cleanUp(currentWord);
    }else{
      continue;
    }
    if (currentWord.includes(wordBeingAnalyzed) && currentWord !== wordBeingAnalyzed){ // If the currentWord contains the wordBeingAnalyzed the assume the currentWord is more complex that the wordBeingAnalyzed (aka the currentWord is NOT  a stem)
      if (stemDict.hasOwnProperty(currentWord)){ // Just in case the more complex word had words mapped to it (i.e. preface : [prefaced] and then we find face so the mapping would become face : [preface, prefaced])
        transferComplexWordsMapping(wordBeingAnalyzed, currentWord);
      }
      addWordToStemDict(wordBeingAnalyzed, currentWord);  // Map the wordBeingAnalyzed to the currentWord (more complex than the wordBeingAnalyzed)
      storeWordMetaData(wordBeingAnalyzed, currentWord); // Store some meta data about the currentWord (how many times it has been seen, and a list of stems found in the word)
      matchFound = true;
    }
  }
  return matchFound;
}

function stemEachComplexWord(stem, listOfComplexWords){
  var index = 0,
      currentWord = '';

  // A stem automatically fits the form of <stem>
  analyzedWords[stem] = generateAnalyzedWordObj(stem, [stem], {});

  if (listOfComplexWords.length === 0){ // There are no complex words (aka the stem is alone in the list)
    return;
  }

  for(; index < listOfComplexWords.length; index++){
    currentWord = listOfComplexWords[index];

    if(analyzedWords.hasOwnProperty(currentWord)){
      continue; // It has already been seen & stemmed in another interation
    }

    if (wordMetaData[currentWord].numOfStems > 1){
      checkForMultipleStemsAndInfix(stem, currentWord); // Check for multiple stems or infix pattern
    }else {
      checkForPrefixAndSuffix(stem, currentWord); // Check for prefix/suffix pattern
    }
  }
}

function analyzeStemDictAndGenerateResults(){
  for(stem in stemDict){
    if (stemDict.hasOwnProperty(stem)){
      stemEachComplexWord(stem, stemDict[stem]);
    }
  }
}

// Entry point from the wrapper
module.exports.decomposeAndStem = function(wordList){
  var currentIndex = 0,
      currentWord  = '';
  init();
  wordList = helper.removedDuplicates(wordList); // Remove duplicates from the wordList

  for(; currentIndex < wordList.length; currentIndex++){
    currentWord = wordList[currentIndex];
    if (check.isValidInput(currentWord)){
      currentWord = helper.cleanUp(currentWord);
      var circumfixCheck = circumfixAffixPatternCheck(currentWord);
      if (circumfixCheck.matched){
        analyzedWords[currentWord] = generateAnalyzedWordObj(currentWord, circumfixCheck.stems, circumfixCheck.affixes);
        continue;
      }
      if (!wordMetaData.hasOwnProperty(currentWord)){ // Regression test
          updateStemDict(currentWord, wordList);
      }
    }else{
      // // remove word from list
      // wordList.splice(wordList.indexOf(currentWord), 1);
      var errorContentParams = {
            expectedType : 'String', //TODO: Move this error throwing logic to new module
            name         : 'currentWord',
            type         : typeof currentWord,
            value        : currentWord
      };
      console.log(exceptionMessages.static.invalidWord + '\n' + // TODO: Change to throw when done testing
                  exceptionMessages.dynamic.notExpectedType(errorContentParams));
      // throw input error
    }
  }
  analyzeStemDictAndGenerateResults();
  console.log('Finished analyzing words!');
  console.log(analyzedWords);
  return analyzedWords;
};

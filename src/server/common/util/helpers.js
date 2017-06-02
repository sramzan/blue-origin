var helpers = function Helpers(){};

helpers.prototype.removedDuplicates = function(wordList){ // Removes duplicates from the list passed in
  wordList = wordList.filter(function(word, index, arr){
    return index === arr.indexOf(word);
  });
  return wordList;
};

helpers.prototype.cleanUp = function(input){
  return input.trim().toLowerCase();
};

helpers.prototype.reverseString = function(str){ // TODO: Move these to a util
  return str.split('').reverse().join('');
};

module.exports.Helpers = helpers;

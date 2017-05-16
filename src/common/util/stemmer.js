
/*
  function will return:
    { word : {
        'stem'    : arr[stems],
        'affixes' : arr[affixes]
      }
    }

  returns { word : {} } if there is no matching format (i.e. does not fit format defined in problem statement)
*/
var vowels = ['a', 'e', 'i', 'o', 'u']; // make obj instead?
function checkForPrefix(word){

};
exports.stemWord = function(word){
  if (word.length > 2){ // Only care to stem words lf length 3 or greater
    checkForPrefix(word);
  }
  return { word : {} }
}

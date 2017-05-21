function reverseString(str){ // TODO: Move to a util
  return str.split('').reverse().join('');
}

function areEqual(str1, str2){
  return str1 === str2;
}

function checkIfEven(num){
  return (num % 2) === 0;
}

function circumfixAffixPattern(word){
  var frontIndex      = 0,
      backIndex       = word.length - 1,
      patternMatched  = false,
      isEven          = checkIfEven(word.length),
      frontExpression = '',
      backExpression  = '',
      results         = {
                          'matches' : false,
                          'affix'   : [],
                          'stem'    : []
                        };

  for (; frontIndex <= backIndex; frontIndex++,backIndex-- ){
    frontExpression = frontExpression + word.charAt(frontIndex);
    backExpression  = backExpression  + word.charAt(backIndex);
    if(areEqual(frontExpression, reverseString(backExpression))){
      // backIndex = ((frontIndex+1 === backIndex) && isEven)    ? frontIndex-1 : backIndex;
      // backIndex = ((frontIndex+1 === backIndex-1) && !isEven) ? backIndex    : backIndex;
        if ((frontIndex < backIndex) && ((frontIndex + 1) !== backIndex)){
        results.matches = true;
        results.affix   = [word.substring(0, frontIndex+1)];
        results.stem    = [word.substring(frontIndex, backIndex)];
        matchedExpr = frontExpression;
      }
    }
  }

  return results;
}

console.log(JSON.stringify(circumfixAffixPattern('sean')));
console.log(JSON.stringify(circumfixAffixPattern('enlightenl')));
console.log(JSON.stringify(circumfixAffixPattern('penlightpenl')));
// console.log(JSON.stringify(circumfixAffixPattern('seansean')));
// console.log(JSON.stringify(circumfixAffixPattern('seansean'))); //not a case
// console.log(JSON.stringify(circumfixAffixPattern('heytherehey')));

// module.exports = {
//
// };

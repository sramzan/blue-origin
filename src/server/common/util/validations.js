var validations = function Validations(){};

validations.prototype.reverseString = function(str){ // TODO: Move these to a util
  return str.split('').reverse().join('');
};

validations.prototype.areEqual = function(str1, str2){
  return str1 === str2;
};

validations.prototype.cleanUp = function(input){
  return input.trim().toLowerCase();
};
//
// function containSpace(input){
//   return
// }

validations.prototype.isValidInput = function(input){
  return input !== null && input !== undefined && input.trim() !== ''; //&& !containsSpace(input);
};

module.exports.Validations = validations;

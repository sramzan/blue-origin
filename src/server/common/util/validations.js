var validations = function Validations(){};

validations.prototype.areEqual = function(str1, str2){
  return str1 === str2;
};

validations.prototype.isValidInput = function(input){
  return input !== null && input !== undefined && input.trim() !== ''; //&& !containsSpace(input);
};

module.exports.Validations = validations;

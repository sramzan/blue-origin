(function() {
    // var app= angular.module("stemmer", []);
    var app = angular.module("stemmer");
    app.controller('mainCtrl', function($scope) {
      $scope.invalid = false;
      var anyNonLetterCharsPattern = "(\d)|(\W+)|(_)", // catches digits, non alphanumeric chars, underscores
          urlFormatPattern="";// catches forms that do not align to 'http://url'

      /*
        * @param {String} input - The input text provided by the user
        * @param {String} regexPattern - The regex expression that will be tested against the input
        * @returns {Boolean} True if the input contains an illegal character, false if not
      */
      function matchesPattern(input, regexPattern){
        var pattern = new RegExp(regexPattern);
        return pattern.test(input);
      }

      function validatesURLInput(input){
        return matchesPattern(input, urlFormatPattern);
      }

      $scope.validateSingleWordInput = function validateSingleWordInput(input){
        if(matchesPattern(input, anyNonLetterCharsPattern)){ // return false if it contains the illegal chars
          //display error
          $scope.invalid = true;
        }else{

        }
      };

      $scope.test = 'ramzan';
    });

}());

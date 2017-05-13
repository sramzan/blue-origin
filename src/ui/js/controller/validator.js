(function() {
    // var app= angular.module("stemmer", []);
    var app = angular.module("stemmer");
    app.controller('mainCtrl', function($scope) {
      function matchesPattern(input, regexPattern){
        var pattern = new RegExp(regexPattern);
        return pattern.test(input);
      }

      $scope.validateSingleWordInput = function validateSingleWordInput(input){
        return !matchesPattern(input, anyNonLetterCharsPattern); // return false if it contains the illegal chars
      };

      $scope.test = 'ramzan';
    });

}());

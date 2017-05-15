(function() {
    // var app= angular.module("stemmer", []);
    var app = angular.module("stemmer"),
        errValidator = new ErrValidator();

    function showErrorMessage($scope, errMess){ // TODO - move to validator engine
      $scope.invalid   = true; //display error
      $scope.errorText = errMess;
    }

    function stem($http, type, input){
      var data = {
        params: {
          'type'      : type,
          'userInput' : input
        }
      };

      $http({
        method : 'GET',
        url    : 'stemmer'
      }).then(function(response){
        if(response.status === 200)
          console.log("Stem Success!");
      },function (error){
        // TODO: Implement graceful error
      });
    }

    app.controller('mainCtrl', ['$scope', '$http', function($scope, $http) {
      $scope.invalid = false;
      $scope.resetValidFlag = function(){ $scope.invalid = false; }
      $scope.validateWordInput  = function(input, type){ // Could make the two validations one function, but this is easier to read & follows one action per function a tad more closely
        if(errValidator.containsInvalidInput(input, 'anyNonLetterCharsPattern')){ // return false if it contains the illegal chars
          showErrorMessage($scope, errMessages.invalidSingleWordInput);
        }else{
          stem($http, 'singleWord', $scope.userInput)
        }
      };

      $scope.validateURLInput = function(input){
        if(errValidator.containsInvalidInput(input, 'anyNonLetterCharsPattern')){
          showErrorMessage($scope, errMessages.invalidURLInput);
        }else{
          var wordList = getWordListFromUrl(input);
          stem(input);
        }
      }

    }]);

}());

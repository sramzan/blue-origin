(function() {
    // var app= angular.module("stemmer", []);
    var app = angular.module("stemmer"),
        errValidator = new ErrValidator();

    function getWordListFromUrl(url){
      makeCorsRequest(url);
      var wordList = null;
      // $.get(url, function(queriedText){
      //   wordList = queriedTextext;
      // })
    }

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
          showErrorMessage($scope, errMessages.INVALID_SINGLE_WORD_INPUT);
        }else{
          stem($http, 'singleWord', $scope.userInput)
        }
      };

      $scope.validateURLInput = function(input){
        if(errValidator.containsInvalidInput(input, '(badUrl)')){ // TODO - Add regex to find invalid url
          showErrorMessage($scope, errMessages.INVALID_URL_INPUT);
        }else{
          var wordList = getWordListFromUrl(input);
          stem($http, 'wordList', input);
        }
      }

    }]);

}());

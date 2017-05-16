(function() {
    var app= angular.module("stemmer"),
        errValidator = new ErrValidator();

    function getWordListFromUrl(url){
      makeCorsRequest(url);
      var wordList = null;
      // $.get(url, function(queriedText){
      //   wordList = queriedTextext;
      // })
    }

    app.controller('mainCtrl', ['$scope', '$http', '$state', function($scope, $http, $state) {
      // Local Methods
      function showErrorMessage($scope, errMess){ // TODO - move to validator engine
        $scope.invalid   = true; //display error
        $scope.errorText = errMess;
      }

      function stem(type, input){
        var data = {
          params: {
            'type'      : type,
            'userInput' : input,
            'context'   : $scope
          }
        };

        $http.get('stemmer', data).then(function(response){
            console.log("Stem Success!");
            response.config.params.context.changeState('stemResults', response.data);
          }, function(error){
        });
      };

      // Scope Level Methods/Attributes
      $scope.invalid = false;
      $scope.resetValidFlag     = function(){ $scope.invalid = false; };
      $scope.changeState        = function(hash, paramObj){
        $state.go(hash, {'results' : paramObj}, {reload : true}); console.log('CALLER: ' + paramObj); };
      $scope.validateWordInput  = function(input, type){ // Could make the two validations one function, but this is easier to read & follows one action per function a tad more closely
        if(errValidator.containsInvalidInput(input, 'anyNonLetterCharsPattern')){ // return false if it contains the illegal chars
          showErrorMessage($scope, errMessages.INVALID_SINGLE_WORD_INPUT);
        }else{
          stem('singleWord', input);
        }
      };
      $scope.validateURLInput = function(input){
        if(errValidator.containsInvalidInput(input, '(badUrl)')){ // TODO - Add regex to find invalid url
          showErrorMessage($scope, errMessages.INVALID_URL_INPUT);
        }else{
          var wordList = getWordListFromUrl(input);
          stem('wordList', input);
        }
      };
    }]);
}());

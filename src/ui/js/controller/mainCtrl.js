(function() {
    var app= angular.module("stemmer"),
        errValidator = new ErrValidator();

    app.controller('mainCtrl', ['$scope', '$http', '$state', '$rootScope', function($scope, $http, $state, $rootScope) {
      // Local Methods
      function showErrorMessage($scope, errMess){ // TODO - move to validator engine
        $scope.invalid   = true; //display error
        $scope.errorText = errMess;
      }

      function stem(type, input, delim){
        var data = {
          params: {
            'type'      : type,
            'userInput' : input,
            'delim'     : delim,
            'context'   : $scope
          }
        };

        $http.get('stemmer', data).then(function(response){
            console.log("Stem Success!");
            response.config.params.context.changeState('stemResults', response.data);
          }, function(error){
        });
      }

      // Scope Level Methods/Attributes
      $scope.invalid = false;
      $scope.hasSearchedForWords = false;
      $scope.changeState = function(hash, paramObj){
        $state.go(hash, {'results' : paramObj}, {reload : true});
      };
      $scope.resetValidFlag     = function(){ $scope.invalid = false; };
      $scope.validateWordInput  = function(input, type){ // Could make the two validations one function, but this is easier to read & follows one action per function a tad more closely
        if(errValidator.containsInvalidInput(input, 'anyNonLetterCharsPattern') || (typeof input !== 'string') || !$scope.hasSearchedForWords){ // return false if it contains the illegal chars
          var errMesage = $scope.hasSearchedForWords ? errMessages.INVALID_SINGLE_WORD_INPUT : errMessages.NO_WORD_LIST_YET;
          showErrorMessage($scope, errMesage);
        }else{
          var deregister = $rootScope.$broadcast('wordLookupRequested', {'word' : input.toLowerCase().trim()});
          $scope.$on('$destroy', deregister);
        }
      };
      $scope.validateURLInput = function(input, delim){
        if(!errValidator.containsInvalidInput(input, 'urlFormatPattern') || (typeof input !== 'string')){ // TODO - Need custom regex, but adding regex found online with source credit
          showErrorMessage($scope, errMessages.INVALID_URL_INPUT);
        }else{
          $scope.hasSearchedForWords = true;
          stem('wordList', input, delim);
        }
      };
    }]);
}());

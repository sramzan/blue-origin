(function() {
    // var app= angular.module("stemmer", []);
    var app = angular.module("stemmer"),
        errValidator = new ErrValidator();

    function showErrorMessage($scope, errMess){
      $scope.invalid   = true; //display error
      $scope.errorText = errMess;
    }
        // errMessages  = new ErrMessages();
    app.controller('mainCtrl', ['$scope', '$http', function($scope, $http) {
      $scope.invalid = false;
      $scope.resetValidFlag = function(){ $scope.invalid = false; }
      $scope.validateSingleWordInput = function(input){
        if(errValidator.containsInvalidInput(input)){ // return false if it contains the illegal chars
          showErrorMessage($scope, errMessages.invalidSingleWordInput);
        }else{
          var data = {
            params: {
              'type'      : 'singleWord',
              'userInput' : $scope.userInput
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
      };

      $scope.validatesURLInput = function(input){
        $scope.invalid   = true;
        $scope.errorText = errMessages.invalidURLInput;
        // if(containsInvalidInput(input)){ // return false if it contains the illegal chars
        //   $scope.invalid = true; //display error
        // }
      }

    }]);

}());

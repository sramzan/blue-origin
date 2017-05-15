(function() {
    // var app= angular.module("stemmer", []);
    var app = angular.module("stemmer");
    app.controller('mainCtrl', ['$scope', '$http', function($scope, $http) {
      $scope.invalid = false;
      $scope.resetValidFlag = function(){ $scope.invalid = false; }
      $scope.validateSingleWordInput = function validateSingleWordInput(input){
        if(containsInvalidInput(input)){ // return false if it contains the illegal chars
          $scope.invalid = true; //display error
        }else{
          var data = {
            params: {
              'type'      : 'singleWord',
              'userInput' : $scope.userInput
            }
          };

          $http({
            method : 'GET',
            url    : 'stem'
          }).then(function(response){
            if(response.status === 200)
              console.log("Stem Success!");
          },function (error){
            // TODO: Implement graceful error
          });

        }
      };

    }]);

}());

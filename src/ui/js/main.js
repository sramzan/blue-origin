(function(){
  angular.module("stemmer", ["ngRoute"]);
  var app = angular.module("stemmer", ["ngRoute"]);
  app.config(function($routeProvider, $locationProvider) {
      $locationProvider.hashPrefix('');
      $routeProvider
      .when("/stemWord", {
          templateUrl : 'results/stemWord.html',
          controller  : 'controller/stemWord.js'
      })
      .when("/", {
          templateUrl : "stemmer.html"
      })
      .when("/green", {
          templateUrl : "green.htm"
      })
      .when("/blue", {
          templateUrl : "blue.htm"
      });
  });

  app.controller('test', function($scope) {
    $scope.test = 'sean';
  });

}());

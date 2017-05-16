(function(){
  console.log('Testing');
  angular.module("stemmer", ["ui.router"]);
  var app = angular.module("stemmer", ["ui.router"]);
  app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
      console.log('Registering navigation');
      $locationProvider.hashPrefix('');
      // $urlRouterProvider.otherwise('/home');
      $stateProvider
      .state('home', {
          url         : '/home',
          controller  : 'mainCtrl'
      })

      .state('stemResults', {
        url         : '/stemResults',
        templateUrl : '/results/stemmerResults.html',
        controller  : 'stemWordCtrl',
        params      : {
          results : null
        }
      });
  });

  app.run(['$state', function ($state) {
    // $state.transitionTo('home');
  }]);
}());

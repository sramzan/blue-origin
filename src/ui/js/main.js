(function(){
  angular.module("stemmer", ["ui.router"]); // Initialize the controller & store in memory
  var app = angular.module("stemmer", ["ui.router"]); // Retrieve the just created controller

  app.config(function($stateProvider, $urlRouterProvider, $locationProvider) { // Configs for the app's routes (invoking the idea of a SPA)
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
    // $state.transitionTo('home'); TODO - Uncomment when finished with testing
  }]);
}());

(function() {
    var app = angular.module('stemmer');
    app.controller('stemWordCtrl', function($scope, $state){
      if ($state.params.results){
        $scope.wordList     = $state.params.results.payload      || [{}];
        $scope.stemColSpan  = $state.params.results.stemColSpan  || 0;
        $scope.affixColSpan = $state.params.results.affixColSpan || 0;
      }
    });

}());

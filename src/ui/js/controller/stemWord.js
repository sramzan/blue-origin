(function() {
    var app = angular.module('stemmer');
    app.controller('stemWordCtrl', function($scope, $state, $rootScope){
      $scope.wordExists = false;
      $scope.showError  = false;
      if ($state.params.results){
        $scope.wordList = $state.params.results;
        // $scope.wordList     = $state.params.results.payload      || [{}];
        // $scope.stemColSpan  = $state.params.results.stemColSpan  || 0;
        // $scope.affixColSpan = $state.params.results.affixColSpan || 0;
      }
      $scope.lookupWord = function(event, args){
        console.log('Looking up word');
        var word = args.word;
        console.log('Word: ' + word);
        if($scope.wordList.hasOwnProperty(word)){
          $scope.resultsToDisplay = [$scope.wordList[word]];
          $scope.stemColSpan      = $scope.resultsToDisplay[0].stems.length;
          console.log('$scope.stemColSpan  :' + $scope.stemColSpan  );
          console.log('resultsToDisplay: ' + JSON.stringify($scope.resultsToDisplay));
          $scope.wordExists       = true;
          $scope.showError        = false;
        }else{
          $scope.wordExists = false;
          $scope.showError  = true;
          $scope.errorText  = errMessages.WORD_DOES_NOT_EXIST;
        }
      };

      $rootScope.$on('wordLookupRequested', $scope.lookupWord);

    });

}());

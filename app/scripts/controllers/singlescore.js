'use strict';
/**
 * @ngdoc function
 * @name uberbooksApp.controller:SingleScoreCtrl
 * @description
 * # SingleScoreCtrl
 * Shows a single score with detailed info.
 */
angular.module('uberbooksApp')
    .controller('SingleScoreCtrl', function ($scope, user, Auth, Ref, $firebaseObject, $firebaseArray, FBURL, geolocation, $routeParams) {

    var scoresRef = new Firebase(FBURL + '/scores');
    var scores = $firebaseArray(scoresRef);
    
    scores.$loaded().then(function(x){
        $scope.score = x.$getRecord($routeParams.scoreId);
    }).catch(function(error){
        console.log("Error: ", error);
    })

    
});
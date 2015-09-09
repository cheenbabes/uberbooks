'use strict';

/**
 * @ngdoc function
 * @name uberbooksApp.controller:UserCtrl
 * @description
 * # UserCtrl* Controller of the uberbooksApp
 */
angular.module('uberbooksApp')
    .controller('UserCtrl', function ($scope, $routeParams, $firebaseArray, $firebaseObject, Ref) {

        var query = Ref.child('users').child($routeParams.userId);
        $scope.thisUser = $firebaseObject(query);


        var queryScores = Ref.child('scores').orderByChild('userid').equalTo($routeParams.userId);
        $scope.userScores = $firebaseArray(queryScores);

        $scope.userScores.$loaded().then(function (x) {
            var currentTime = (new Date).getTime() + 150000;
            var oneWeekPrevious = currentTime - 604800000; //one week
            $scope.oneWeekScores = []
            for (var i = 0; i < x.length; i++) {
                if (x[i].timestamp >= oneWeekPrevious && x[i].timestamp <= currentTime) {
                    $scope.oneWeekScores.push(x[i]);
                }

            }

        }).catch(function (error) {
            $scope.error = error
        });

    });
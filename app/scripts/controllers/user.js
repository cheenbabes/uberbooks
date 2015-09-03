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

    });
'use strict';

/**
 * @ngdoc function
 * @name uberbooksApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the uberbooksApp
 */
angular.module('uberbooksApp')
    .controller('MainCtrl', function ($scope, geolocation, $firebaseArray, Ref) {
        //grab the last 50 scores
        //eventually this will be paginated to 10 scores a page

        $scope.scores = $firebaseArray(Ref.child('scores').limitToLast(50));


    });
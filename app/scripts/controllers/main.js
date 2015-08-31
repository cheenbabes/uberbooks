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
    //grab the last 25 scores
    
    $scope.scores = $firebaseArray(Ref.child('scores').limitToLast(10));
    
    
    //$scope.

    
    
    
//          MOVE THIS ALL OVER TO MAP CTRL    
//        //grab location
//        geolocation.getLocation().then(function (data) {
//            $scope.coords = {
//                lat: data.coords.latitude,
//                lon: data.coords.longitude
//            };
//        });
//
//        $scope.map = {
//            center: {
//                latitude: 40,
//                longitude: -105
//            },
//            zoom: 8
//        };


    });
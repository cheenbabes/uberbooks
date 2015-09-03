'use strict';

/**
 * @ngdoc function
 * @name uberbooksApp.controller:MapCtrl
 * @description
 * # MapCtrl
 * Controller of the uberbooksApp
 */
angular.module('uberbooksApp')
    .controller('MapCtrl', function ($scope, $firebaseArray, $firebaseObject, geolocation, Ref, Flash) {
        //grab location...async ugh
        geolocation.getLocation().then(function (data) {
            $scope.coords = {
                lat: data.coords.latitude,
                lon: data.coords.longitude
            };

            $scope.scores = $firebaseArray(Ref.child('scores').limitToLast(50));

            $scope.showInfoWindow = function (event, score) {
                var infoWindow = new google.maps.InfoWindow();
                var center = new google.maps.LatLng(score.lat, score.lon);

                infoWindow.setContent('<h3> $' + score.money + ' for ' + score.books + ' books</h3>');
                infoWindow.setPosition(center);
                infoWindow.open($scope.map);

            };
        });

    });
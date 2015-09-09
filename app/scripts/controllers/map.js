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

            $scope.icon = {
                url: 'http://plebeosaur.us/etc/map/bluedot_retina.png',
                size: null, // size
                origin: null, // origin
                anchor: new google.maps.Point(8, 8), // anchor (move to center of marker)
                scaledSize: new google.maps.Size(17, 17) // scaled size (required for Retina display icon)
            };

            $scope.showInfoWindow = function (event, score) {
                var infoWindow = new google.maps.InfoWindow();
                var center = new google.maps.LatLng(score.lat, score.lon);

                infoWindow.setContent('<h3> $' + score.money + ' for ' + score.books + ' books</h3>');
                infoWindow.setPosition(center);
                infoWindow.open($scope.map);

            };
        });

    });
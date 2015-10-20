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

            $scope.scores = $firebaseArray(Ref.child('scores').limitToLast(250));

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

                infoWindow.setContent('<h4>Summary</h4><p>Money: $' + score.money + '</p><p>Books: ' + score.books + '</p><p>Distributed by ' +
                    score.user + '</p><p>' + new Date(score.timestamp).toString() + '</p>');
                infoWindow.setPosition(center);
                infoWindow.open($scope.map);

            };

            Flash.create('success', "Displaying the last 250 scores");
        }).catch(function (error) {
            console.log(error);
            Flash.create('danger', "You have rejected geolocation services. You will not be able to see the map unless you enable your browser geolocation! Please check <a href='https://waziggle.com/BrowserAllow.aspx'>here</a> on how to enable it.");
        });

    });
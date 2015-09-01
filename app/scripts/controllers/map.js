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
        //get the last 50 scores


        //grab location...async ugh
        geolocation.getLocation().then(function (data) {
            $scope.coords = {
                lat: data.coords.latitude,
                lon: data.coords.longitude
            };

            var image = new google.maps.MarkerImage(
                'http://plebeosaur.us/etc/map/bluedot_retina.png',
                null, // size
                null, // origin
                new google.maps.Point(8, 8), // anchor (move to center of marker)
                new google.maps.Size(17, 17) // scaled size (required for Retina display icon)
            );
            var mapOptions = {
                zoom: 13,
                center: new google.maps.LatLng($scope.coords.lat, $scope.coords.lon),
                mapTypeId: google.maps.MapTypeId.TERRAIN
            }

            $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

            $scope.marker = new google.maps.Marker({
                position: new google.maps.LatLng($scope.coords.lat, $scope.coords.lon),
                map: $scope.map,
                title: 'Hello World',
                icon: image
            });

            $scope.scores = $firebaseArray(Ref.child('scores').limitToLast(50));
            $scope.scores.$loaded().then(function (x) {
                var scoreMarker;
                for (var i = 0; i < x.length; i++) {
                    scoreMarker = new google.maps.Marker({
                        position: new google.maps.LatLng(x[i].lat, x[i].lon),
                        map: $scope.map
                    });
                }
            }).catch(function (error) {
                console.log("Error: ", error);
                Flash.create('danger', "Looks like there was an error");
            });

        });




    });
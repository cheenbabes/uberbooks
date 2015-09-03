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

        $scope.style = [
            {
                "featureType": "administrative",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
            }
        ]
    },
            {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "simplified"
            },
                    {
                        "hue": "#0066ff"
            },
                    {
                        "saturation": 74
            },
                    {
                        "lightness": 100
            }
        ]
    },
            {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "simplified"
            }
        ]
    },
            {
                "featureType": "road",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "simplified"
            }
        ]
    },
            {
                "featureType": "road.highway",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
            },
                    {
                        "weight": 0.6
            },
                    {
                        "saturation": -85
            },
                    {
                        "lightness": 61
            }
        ]
    },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [
                    {
                        "visibility": "on"
            }
        ]
    },
            {
                "featureType": "road.arterial",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
            }
        ]
    },
            {
                "featureType": "road.local",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "on"
            }
        ]
    },
            {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "simplified"
            }
        ]
    },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "simplified"
            },
                    {
                        "color": "#5f94ff"
            },
                    {
                        "lightness": 26
            },
                    {
                        "gamma": 5.86
            }
        ]
    }
]




    });
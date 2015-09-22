'use strict';
/**
 * @ngdoc function
 * @name uberbooksApp.controller:ScoresCtrl
 * @description
 * # ScoresCtrl
 * Manages score input.
 */
angular.module('uberbooksApp')
    .controller('ScoresCtrl', function ($scope, user, Auth, Ref, $firebaseObject, $firebaseArray, FBURL, geolocation, Flash) {

        $scope.scores = $firebaseArray(Ref.child('scores').limitToLast(50));

        $scope.user = user;

        //grab location
        geolocation.getLocation().then(function (data) {
            $scope.coords = {
                lat: data.coords.latitude,
                lon: data.coords.longitude
            };

            $scope.profile = $firebaseObject(Ref.child('users/' + user.uid));
            $scope.user = user;

            //submit the score
            $scope.addScore = function () {
                $scope.scores.$add({
                    money: $scope.score.money,
                    books: $scope.score.books,
                    timestamp: Firebase.ServerValue.TIMESTAMP,
                    user: $scope.profile.name,
                    email: $scope.profile.email ? $scope.profile.email : null,
                    userid: user.uid,
                    lat: $scope.coords.lat,
                    lon: $scope.coords.lon,
                    location: getFormattedAddress($scope.coords.lat, $scope.coords.lon)
                });
                $scope.score.money = '';
                $scope.score.books = '';
                Flash.create('success', 'Thank you for submitting your score!');

            };

        });


        //get the last 10 scores
        $scope.scores = $firebaseArray(Ref.child('scores').limitToLast(10));

        //logout now
        $scope.logout = function () {
            Auth.$unauth();
        };

        var scoresRef = new Firebase(FBURL + '/scores');

        $scope.userScores = $firebaseArray(scoresRef.orderByChild('userid').equalTo(user.uid));

        function getFormattedAddress(lat, lon) {
            var geocoder = new google.maps.Geocoder();
            var latlng = {
                lat: lat,
                lng: lon
            };
            geocoder.geocode({
                    'location': latlng
                },
                function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[3]) {
                            return results[3].formatted_address;
                        } else if (results[2]) {
                            return results[2].formatted_address;
                        } else if (results[1]) {
                            return results[1].formatted_address;
                        } else {
                            return "";
                        }
                    } else {
                        return "";
                    }
                })
        }

    });
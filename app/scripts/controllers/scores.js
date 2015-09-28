'use strict';
/**
 * @ngdoc function
 * @name uberbooksApp.controller:ScoresCtrl
 * @description
 * # ScoresCtrl
 * Manages score input.
 */
angular.module('uberbooksApp')
    .controller('ScoresCtrl', ['$scope', 'user', 'Auth', 'Ref', '$firebaseObject', '$firebaseArray', 'FBURL', 'geolocation', 'Flash', function ($scope, user, Auth, Ref, $firebaseObject, $firebaseArray, FBURL, geolocation, Flash) {

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
                var intBooks;
                var moneyError, bookError = false;
                var floatMoney = parseFloat($scope.score.money).toFixed(2);
                if ($scope.score.books % 1 === 0) {
                    intBooks = parseInt($scope.score.books);
                } else {
                    bookError = true;
                }
                if (floatMoney < 0.50 || floatMoney > 300) {
                    moneyError = true;
                }
                if (isNaN(intBooks) || intBooks < 1 || intBooks > 25) {
                    bookError = true;
                }
                if (moneyError) {
                    Flash.create('danger', "Your score was <b>not submitted</b>. There is a problem with amount of money you entered. Please correct it and try again.");
                } else if (bookError) {
                    Flash.create('danger', "Your score was <b>not submitted</b>. There is a problem with the number of books you entered. It must be a whole number between 1 and 25");
                } else {
                    $scope.scores.$add({
                        money: floatMoney,
                        books: intBooks,
                        timestamp: Firebase.ServerValue.TIMESTAMP,
                        user: $scope.profile.name,
                        email: $scope.profile.email ? $scope.profile.email : null,
                        userid: user.uid,
                        lat: $scope.coords.lat,
                        lon: $scope.coords.lon
                    });
                    $scope.score.money = '';
                    $scope.score.books = '';
                    Flash.create('success', 'Thank you for submitting your score!');
                };
            }

        });


        //get the last 10 scores
        $scope.scores = $firebaseArray(Ref.child('scores').limitToLast(10));

        //logout now
        $scope.logout = function () {
            Auth.$unauth();
        };

        var scoresRef = new Firebase(FBURL + '/scores');

        $scope.userScores = $firebaseArray(scoresRef.orderByChild('userid').equalTo(user.uid));
            }]);
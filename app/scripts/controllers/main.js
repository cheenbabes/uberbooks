'use strict';

/**
 * @ngdoc function
 * @name uberbooksApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the uberbooksApp
 */
angular.module('uberbooksApp')
    .controller('MainCtrl', function ($scope, geolocation, $firebaseArray, Ref, FBURL, Flash) {
        //grab the last 50 scores
        //eventually this will be paginated to 10 scores a page
        $scope.scores = $firebaseArray(Ref.child('scores').limitToLast(50));

        //default stat values
        $scope.statsTimeLength = 86400000;
        $scope.statisticTime = '24 hours';
        //call the function to update the stats
        calculateStatsBasedOnQuery();
    
        //function to update the timeperiod in milliseconds and the text description
        //each call refreshes the query and updates the statistics
        $scope.updateStatsLength = function updateStatsLength(time, description) {
            $scope.statsTimeLength = time;
            $scope.statisticTime = description;
            calculateStatsBasedOnQuery();
        }

        //function to calculate stats based on parameters
        function calculateStatsBasedOnQuery() {
            var endTime = (new Date).getTime() + 100000; //add 1.66 minute offset to make scores load faster
            var startTime = endTime - $scope.statsTimeLength //50400000;

            var query = Ref.child('scores').orderByChild('timestamp').startAt(startTime).endAt(endTime);

            query.on('value', function (snapshot) {
                console.log(snapshot.val());
                $scope.timescores = $firebaseArray(query);


                $scope.timescores.$loaded().then(function (x) {
                    $scope.totalMoney = x.reduce(function (i, score) {
                        return i + parseInt(score.money);
                    }, 0);
                    $scope.totalBooks = x.reduce(function (i, score) {
                        return i + parseInt(score.books);
                    }, 0);


                }).catch(function (error) {
                    console.log("Error: ", error);
                });
            });
        }
    });
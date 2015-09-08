'use strict';

/**
 * @ngdoc function
 * @name uberbooksApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the uberbooksApp
 */
angular.module('uberbooksApp')
    .controller('MainCtrl', function ($scope, geolocation, $firebaseArray, Ref, FBURL, Flash, $firebaseObject) {
        //scores used for rankings. These will be for the last week.
        var currentTime = (new Date).getTime() + 150000;
        var oneWeekPrevious = currentTime - 604800000; //one week, 168 hours
        $scope.rankings = $firebaseArray(Ref.child('rankings'));
        //        $scope.specificScore = $firebaseArray(Ref.child('scores').orderByChild('userid').equalTo("simplelogin:5"));


        var scoreRankQuery = Ref.child('scores').orderByChild('timestamp').startAt(oneWeekPrevious).endAt(currentTime);
        scoreRankQuery.on('value', function snapshot() {
            $scope.rankingScores = $firebaseArray(scoreRankQuery);
            $scope.rankingScores.$loaded().then(function (arrayItem) {
                $scope.result = groupBy($scope.rankingScores, function (arrayItem) {
                    return [arrayItem.userid];
                });

                for (var j = 0; j < $scope.result.length; j++) {
                    //all the records for a particular person have the same userid, so get the first one.  
                    //This would be something like "simplelogin:10"
                    var uid = $scope.result[j][0].userid;
                    var name = $scope.result[j][0].user;
                    var user = {
                        name: name,
                        id: uid,
                        money: $scope.result[j].reduce(function (i, score) {
                            return i + parseInt(score.money);
                        }, 0),
                        books: $scope.result[j].reduce(function (i, score) {
                            return i + parseInt(score.books);
                        }, 0)
                    }
                    console.log(user);
                    Ref.child('rankings').child(uid).once('value', function (snapshot) {
                        //if data exists
                        if (snapshot.exists()) {
                            snapshot.ref().update(user);
                        } else {
                            var payload = {};
                            payload[uid] = user;
                            snapshot.ref().parent().update(payload);
                        }

                    });
                }
            }).catch(function (error) {
                $scope.error = error;
            });
        });

        function groupBy(array, f) {
            var groups = {};
            array.forEach(function (o) {
                var group = JSON.stringify(f(o));
                groups[group] = groups[group] || [];
                groups[group].push(o);
            });
            return Object.keys(groups).map(function (group) {
                return groups[group];
            })
        }


        function reduceArray(array, field) {
            array.reduce(function (i, x) {
                return i + parseInt(x.field);
            }, 0);
        }


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
            //add 2.5 minute offset to account for disparity in server times. Makes new scores instantly available for statistics calculations
            var endTime = (new Date).getTime() + 150000;
            var startTime = endTime - $scope.statsTimeLength

            var query = Ref.child('scores').orderByChild('timestamp').startAt(startTime).endAt(endTime);

            query.on('value', function (snapshot) {
                //                console.log(snapshot.val());
                $scope.timescores = $firebaseArray(query);


                $scope.timescores.$loaded().then(function (x) {
                    $scope.totalMoney = x.reduce(function (i, score) {
                        return i + parseInt(score.money);
                    }, 0);
                    $scope.totalBooks = x.reduce(function (i, score) {
                        return i + parseInt(score.books);
                    }, 0);

                    var uniqueDevotees = [];
                    for (var i = 0; i < $scope.timescores.length; i++) {
                        if ($.inArray($scope.timescores[i].userid, uniqueDevotees) === -1) {
                            uniqueDevotees.push($scope.timescores[i].userid);
                        }
                    }
                    $scope.devoteeCount = uniqueDevotees.length;

                }).catch(function (error) {
                    console.log("Error: ", error);
                });
            });
        }

    });
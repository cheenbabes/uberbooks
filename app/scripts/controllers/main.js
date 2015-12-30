'use strict';

/**
 * @ngdoc function
 * @name uberbooksApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the uberbooksApp
 */
angular.module('uberbooksApp')
    .controller('MainCtrl', ['$scope', 'geolocation', '$firebaseArray', 'Ref', 'FBURL', 'Flash', '$firebaseObject', function ($scope, geolocation, $firebaseArray, Ref, FBURL, Flash, $firebaseObject) {
        //calendar dates
        //FUTURE IMPL to sort by user input dates
        $scope.date = new Date();


        //scores used for rankings. These will be for the last week.
        var currentTime = (new Date).getTime() + 150000;
        var oneWeekPrevious = currentTime - 604800000; //one week, 168 hours

        //grab the rankings and have firebase sort them
        $scope.rankings = $firebaseArray(Ref.child('rankings'));

        var scoreRankQuery = Ref.child('scores').orderByChild('timestamp').startAt(oneWeekPrevious).endAt(currentTime);
        scoreRankQuery.on('value', function snapshot() {
            $scope.rankingScores = $firebaseArray(scoreRankQuery);
            $scope.rankingScores.$loaded().then(function (arrayItem) {
                $scope.result = groupBy($scope.rankingScores, function (arrayItem) {
                    return [arrayItem.userid];
                });
                var scoreArray = [];
                for (var j = 0; j < $scope.result.length; j++) {
                    //all the records for a particular person have the same userid, so get the first one.  
                    //This would be something like "simplelogin:10"
                    var uid = $scope.result[j][0].userid;
                    var name = $scope.result[j][($scope.result[j].length - 1)].user;
                    var user = {
                        name: name,
                        id: uid,
                        money: $scope.result[j].reduce(function (i, score) {
                            return i + parseInt(score.money);
                        }, 0),
                        books: $scope.result[j].reduce(function (i, score) {
                            return i + parseInt(score.books);
                        }, 0),
                        mapArea: calculatePolygonArea($scope.result[j]),
                        timestamp: Firebase.ServerValue.TIMESTAMP
                    }
                    console.log(user);
                    scoreArray.push(user);
                    Ref.child('rankings').child(uid).once('value', function (snapshot) {
                        //if data exists
                        if (snapshot.exists()) {
                            if (user.books > snapshot.val().books && user.money > snapshot.val().money) {
                                snapshot.ref().update(user);
                            } else {
                                console.log("Higher value encountered, not writing to Firebase");
                            }

                        } else {
                            var payload = {};
                            payload[uid] = user;
                            snapshot.ref().parent().update(payload);
                        }

                    });
                }
                $scope.scoreArray = scoreArray;
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

        function calculatePolygonArea(array) {
            var convexHull = new ConvexHullGrahamScan();
            array.forEach(function (item) {
                convexHull.addPoint(item.lon, item.lat);
            });

            $scope.pageHullPoints = convexHull.getHull();
            var googlePolygonPoints = $scope.pageHullPoints.map(function (item) {
                return new google.maps.LatLng(item.y, item.x);
            });

            $scope.pageHullPoints = $scope.pageHullPoints.map(function (item) {
                return [item.y, item.x];
            })

            var polygon = new google.maps.Polygon({
                paths: googlePolygonPoints
            })

            return google.maps.geometry.spherical.computeArea(polygon.getPath());
        }


        //grab the last 50 scores, pagination is now enabled
        $scope.scores = $firebaseArray(Ref.child('scores').limitToLast(50));

        //default stat values
        $scope.statsTimeLength = 86400000;
        $scope.statisticTime = '24 hour';
        //call the function to update the stats
        calculateStatsBasedOnQuery();

        //function to update the timeperiod in milliseconds and the text description
        //each call refreshes the query and updates the statistics
        $scope.updateStatsLength = function updateStatsLength(time, description) {
            $scope.statsTimeLength = time;
            $scope.statisticTime = description;
            calculateStatsBasedOnQuery();
            window.addEventListener("load", function () {
                setTimeout(triggerCharts, 400);
            }, false);

            function triggerCharts() {
                $(document).trigger('redraw.bs.charts');
            }
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

                    $scope.xvariable = x;

                    if (x.length == 0) {
                        $scope.totalMapArea = 0
                    } else {
                        $scope.totalMapArea = calculatePolygonArea(x);
                    }

                    $scope.onlyMoneyValues = x.map(function (item) {
                        return parseFloat(item.money);
                    })

                    $scope.onlyBookValues = x.map(function (item) {
                        return parseFloat(item.books);
                    })

                    var labels = [];
                    for (var k = 0; k < x.length; k++) {
                        labels.push(0);
                    }

                    var moneyChartData = {
                        labels: labels,
                        datasets: [
                            {
                                fillColor: 'rgba(255,255,255,0.3)',
                                strokeColor: '#fff',
                                pointStrokeColor: '#fff',
                                data: $scope.onlyMoneyValues
                            }
                        ]
                    }

                    var bookChartData = {
                        labels: labels,
                        datasets: [
                            {
                                fillColor: 'rgba(255,255,255,0.3)',
                                strokeColor: '#fff',
                                pointStrokeColor: '#fff',
                                data: $scope.onlyBookValues
                            }
                        ]
                    }

                    var moneyOptions = {
                        animation: true,
                        responsive: true,
                        bezierCurve: true,
                        bezierCurveTension: 0.25,
                        showScale: false,
                        scaleOverride: false,
                        scaleSteps: 100,
                        scaleStepWidth: 1,
                        scaleStartValue: 0,
                        pointDotRadius: 0,
                        pointDotStrokeWidth: 0,
                        pointDot: false,
                        showTooltips: false
                    }

                    var bookOptions = {
                        animation: true,
                        responsive: true,
                        bezierCurve: true,
                        bezierCurveTension: 0.25,
                        showScale: false,
                        scaleOverride: false,
                        scaleSteps: 10,
                        scaleStepWidth: 1,
                        scaleStartValue: 0,
                        pointDotRadius: 0,
                        pointDotStrokeWidth: 0,
                        pointDot: false,
                        showTooltips: false
                    }

                    new Chart(document.getElementById('moneyChart').getContext('2d')).Line(moneyChartData, moneyOptions);
                    new Chart(document.getElementById('booksChart').getContext('2d')).Line(bookChartData, bookOptions);


                }).catch(function (error) {
                    console.log("Error: ", error);
                });
            });
        }

    }]);
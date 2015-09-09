'use strict';

/**
 * @ngdoc function
 * @name uberbooksApp.controller:UserCtrl
 * @description
 * # UserCtrl* Controller of the uberbooksApp
 */
angular.module('uberbooksApp')
    .controller('UserCtrl', function ($scope, $routeParams, $firebaseArray, $firebaseObject, Ref) {

        var query = Ref.child('users').child($routeParams.userId);
        $scope.thisUser = $firebaseObject(query);


        var queryScores = Ref.child('scores').orderByChild('userid').equalTo($routeParams.userId);
        $scope.userScores = $firebaseArray(queryScores);

        $scope.userScores.$loaded().then(function (x) {
            var currentTime = (new Date).getTime() + 150000;
            var oneWeekPrevious = currentTime - 604800000; //one week
            $scope.oneWeekScores = []
            for (var i = 0; i < x.length; i++) {
                if (x[i].timestamp >= oneWeekPrevious && x[i].timestamp <= currentTime) {
                    $scope.oneWeekScores.push(x[i]);
                }
            };

            //put all the scores coords in an array
            $scope.oneWeekScoresCoords = []
            for (var j = 0; j < $scope.oneWeekScores.length; j++) {
                $scope.oneWeekScoresCoords.push([$scope.oneWeekScores[j].lat, $scope.oneWeekScores[j].lon]);
            }

            var convexHull = new ConvexHullGrahamScan();
            $scope.oneWeekScoresCoords.forEach(function (item) {
                convexHull.addPoint(item[1], item[0]);
            });

            $scope.hullPoints = convexHull.getHull();
            $scope.pageHullPoints = $scope.hullPoints.map(function (item) {
                return [item.y, item.x];
            })

            $scope.googlePolygonPoints = $scope.hullPoints.map(function (item) {
                return new google.maps.LatLng(item.y, item.x);
            })

            var polygon = new google.maps.Polygon({
                paths: $scope.googlePolygonPoints
            });

            $scope.polygonArea = google.maps.geometry.spherical.computeArea(polygon.getPath());


        }).catch(function (error) {
            $scope.error = error
        });

    });
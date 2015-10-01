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
            var oneWeekPrevious = currentTime - 5184000000; //60 days
            $scope.oneWeekScores = []
            for (var i = 0; i < x.length; i++) {
                if (x[i].timestamp >= oneWeekPrevious && x[i].timestamp <= currentTime) {
                    $scope.oneWeekScores.push(x[i]);
                }
            };

            $scope.polygonArea = calculatePolygonArea($scope.oneWeekScores);


        }).catch(function (error) {
            $scope.error = error
        });

        var userId = $routeParams.userId;
        $scope.ranking = $firebaseObject(Ref.child('rankings').orderByChild('id').equalTo($routeParams.userId));
        $scope.ranking.$loaded().then(function (x) {
            $scope.ranking = x[userId];
        })




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

    });
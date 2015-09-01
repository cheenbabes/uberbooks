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
        

        //get the data for the stats.
        //Currently hardcoded to 24 hours.
        var currentTime = (new Date).getTime();
        var before = currentTime - 2700000; //86400000;

        var ref = new Firebase('https://uberbooks.firebaseio.com/scores');

        var query = ref.orderByChild('timestamp').startAt(before).endAt(currentTime);

        query.on('value', function (snapshot) {
            console.log(snapshot.val());
        });
    
    $scope.timescores = $firebaseArray(query);


        //        var scoresRef = Ref.child("scores");
        //        scoresRef.on('value', function (dataSnapshot) {
        //            var summaryScores = $firebaseArray(scoresRef);//.orderByChild('timestamp').startAt(twentyFoursHoursAgo).endAt(currentTime);
        //            $scope.summaryScores = summaryScores;
        //            console.log(summaryScores);
        //            
        //            summaryScores.$loaded().then(function (x) {
        //                $scope.totalMoney = x.reduce(function (i, score) {
        //                    return i + parseInt(score.money);
        //                }, 0);
        //                $scope.totalBooks = x.reduce(function (i, score) {
        //                    return i + parseInt(score.books);
        //                }, 0);
        //                
        //                
        //            }).catch(function (error) {
        //                console.log("Error: ", error);
        //            })
        //
        //        });




    });
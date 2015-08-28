//'use strict';
//
//angular.module('uberbooksApp')
//    .factory('ScoresClass', function ($firebaseArray, $firebaseObject, FBURL) {
//
//        var firebaseRef = new Firebase(FBURL + '/scores');
//        var scoresArray = $firebaseArray(firebaseRef.child('scores');
//
//        var ScoresClass = {
//            lastNumberOfScores: function (number) {
//
//                   return $firebaseArray(firebaseRef.child('scores').limitToLast(number));
//
//            },
//            getScoresByUserId: function (userId) {
//
//                 return  $firebaseArray(firebaseRef.orderByChild('userid').equalTo(userId));
//
//            }
//        };
//    });
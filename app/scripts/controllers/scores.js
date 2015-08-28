'use strict';
/**
 * @ngdoc function
 * @name uberbooksApp.controller:ScoresCtrl
 * @description
 * # ScoresCtrl
 * Manages score input.
 */
angular.module('uberbooksApp')
.controller('ScoresCtrl', function($scope, user, Auth, Ref, $firebaseObject, $firebaseArray, FBURL){
    
    $scope.profile = $firebaseObject(Ref.child('users/'+user.uid));
    
    $scope.user = user;
    
    
    //get the last 10 scores
    $scope.scores = $firebaseArray(Ref.child('scores').limitToLast(10));

    
    //submit the score
    $scope.addScore = function(){
        $scope.scores.$add(
            {
                money: $scope.score.money,
                books: $scope.score.books,
                timestamp: Firebase.ServerValue.TIMESTAMP,
                user: $scope.profile.name,
                email: $scope.profile.email ? $scope.profile.email : null ,
                userid: user.uid
            });
            $scope.score.money ="";
            $scope.score.books = "";
        
    }
    
    
    //logout now
    $scope.logout = function() { Auth.$unauth(); };
    
    var scoresRef = new Firebase(FBURL + '/scores');
    
    $scope.userScores = $firebaseArray(scoresRef.orderByChild('userid').equalTo(user.uid));
});
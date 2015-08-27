'use strict';

/**
 * @ngdoc function
 * @name uberbooksApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the uberbooksApp
 */
angular.module('uberbooksApp')
  .controller('MainCtrl', function ($scope, user) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

  });

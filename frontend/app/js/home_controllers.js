// Generated by CoffeeScript 1.8.0
(function() {
  angular.module('resto.homeControllers', []).controller('HomeController', function($scope, $http, Resto) {
    return $scope.restos = Resto.query();
  });

}).call(this);

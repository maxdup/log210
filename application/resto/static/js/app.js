(function() {
  angular.module('restoApp', ['resto.controllers', 'resto.services']).config(function($routeProvider, $httpProvider) {
    $routeProvider.when('/home', {
      templateUrl: 'static/partials/home.html'
    }).when('/register', {
      controller: 'RegisterController',
      templateUrl: 'static/partials/register.html'
    }).when('/manage/users', {
      controller: 'UserController',
      templateUrl: 'static/partials/manage_users.html'
    }).otherwise({
      redirectTo: '/home'
    });
    return $httpProvider.defaults.headers.common['X-CSRFToken'] = CSRF_TOKEN;
  });

}).call(this);

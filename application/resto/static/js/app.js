(function() {
  angular.module('restoApp', ['resto.userControllers', 'resto.restoControllers', 'resto.services', 'resto.directives']).config(function($routeProvider, $httpProvider) {
    $routeProvider.when('/home', {
      templateUrl: 'static/partials/home.html'
    }).when('/register', {
      controller: 'RegisterController',
      templateUrl: 'static/partials/register.html'
    }).when('/manage/users', {
      controller: 'UserController',
      templateUrl: 'static/partials/manage_users.html'
    }).when('/profile', {
      controller: 'UserController',
      templateUrl: 'static/partials/profile.html'
    }).when('/manage/resto', {
      controller: 'RestaurantController',
      templateUrl: 'static/partials/manage_resto.html'
    }).otherwise({
      redirectTo: '/home'
    });
    return $httpProvider.defaults.headers.common['X-CSRFToken'] = CSRF_TOKEN;
  });

}).call(this);

// Generated by CoffeeScript 1.8.0
(function() {
  angular.module('restoApp', ['resto.userControllers', 'resto.restoControllers', 'resto.services']).config(function($routeProvider, $httpProvider) {
    $routeProvider.when('/home', {
      templateUrl: 'static/partials/home.html'
    }).when('/register', {
      controller: 'UserController',
      templateUrl: 'static/partials/register.html'
    }).when('/profile', {
      controller: 'UserController',
      templateUrl: 'static/partials/profile.html'
    }).when('/admin/users', {
      controller: 'UserController',
      templateUrl: 'static/partials/admin_users.html'
    }).when('/admin/resto', {
      controller: 'RestaurantController',
      templateUrl: 'static/partials/admin_resto.html'
    }).when('/manage_menu/:param', {
      controller: 'RestaurantController',
      templateUrl: 'static/partials/manage_menu.html'
    }).when('/manage/resto', {
      controller: 'RestaurantController',
      templateUrl: 'static/partials/manage_resto.html'
    }).otherwise({
      redirectTo: '/home'
    });
    return $httpProvider.defaults.headers.common['X-CSRFToken'] = CSRF_TOKEN;
  });

}).call(this);

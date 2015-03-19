angular.module('restoApp', ['ngRoute', 'resto.userControllers', 'resto.restoControllers', 'resto.menuControllers', 'resto.homeControllers', 'resto.commandeControllers','resto.services', 'gettext'])
.config ($routeProvider, $httpProvider) ->
  $routeProvider
  .when '/home',
    controller: 'HomeController'
    templateUrl: 'static/partials/home.html'
  .when '/register',
    controller: 'UserController',
    templateUrl: 'static/partials/register.html'
  .when '/profile',
    controller: 'UserController',
    templateUrl: 'static/partials/profile.html'
  .when '/admin/users',
    controller: 'UserController',
    templateUrl: 'static/partials/admin_users.html'
  .when '/admin/resto',
    controller: 'RestaurantController',
    templateUrl: 'static/partials/admin_resto.html'
  .when '/manage_menu/:param',
    controller: 'MenuController',
    templateUrl: 'static/partials/manage_menu.html'
  .when '/manage/resto',
    controller: 'RestaurantController',
    templateUrl: 'static/partials/manage_resto.html'
  .when '/resto/:param',
    controller: 'CommandeController',
    templateUrl: 'static/partials/commande.html'
  .when '/manage_commande/:param',
    controller: 'CommandeManageController',
    templateUrl: 'static/partials/manage_commande.html'
  .when '/commande/:param',
    controller: 'CommandeConfirmController',
    templateUrl: 'static/partials/commande_success.html'
  .when '/deliver_commande',
    controller: 'CommandeManageController',
    templateUrl: 'static/partials/deliver_commande.html'

  .otherwise
    redirectTo: '/home'

  $httpProvider.defaults.xsrfCookieName = 'csrftoken';
  $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

.run (gettextCatalog) ->
  gettextCatalog.setCurrentLanguage('en');
  gettextCatalog.debug = true;
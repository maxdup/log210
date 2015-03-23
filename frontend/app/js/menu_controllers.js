// Generated by CoffeeScript 1.8.0
(function() {
  angular.module('resto.menuControllers', []).controller('MenuController', function($scope, $location, $http, $routeParams, Resto) {
    var param;
    param = $routeParams.param;
    Resto.query().$promise.then(function(value) {
      var resto;
      return $scope.current_resto = ((function() {
        var _i, _len, _results;
        _results = [];
        for (resto = _i = 0, _len = value.length; _i < _len; resto = ++_i) {
          resto = value[resto];
          if (resto.pk === param) {
            _results.push(resto);
          }
        }
        return _results;
      })())[0];
    });
    $scope.add_menu = function() {
      if (!($scope.current_resto.menu.hasOwnProperty('sous_menus'))) {
        $scope.current_resto.menu.sous_menus = [];
      }
      if ($scope.new_menu_name) {
        $scope.current_resto.menu.sous_menus.push({
          'name': $scope.new_menu_name,
          'items': []
        });
      } else {
        alert('Le menu doit avoir un nom');
      }
      return $scope.new_menu_name = '';
    };
    $scope.add_menuitem = function(menu) {
      if (menu.hasOwnProperty('newitem') && menu.newitem.name && menu.newitem.price) {
        menu.items.push(menu.newitem);
        if (!menu.newitem.desc) {
          alert("il est préférable d'avoir une description");
        }
        menu.newitem = {
          'name': '',
          'desc': '',
          'price': ''
        };
        return $scope.save_menu();
      } else {
        return alert('il faut spécifier un nom et un prix');
      }
    };
    return $scope.save_menu = function() {
      var empty_menus, menu, _i, _len, _ref;
      empty_menus = [];
      _ref = $scope.current_resto.menu.sous_menus;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        menu = _ref[_i];
        if (_.isEmpty(menu.items)) {
          empty_menus.push(menu);
        }
      }
      $scope.current_resto.menu.sous_menus = _.difference($scope.current_resto.menu.sous_menus, empty_menus);
      return Resto.update({
        id: $scope.current_resto.pk
      }, $scope.current_resto);
    };
  });

}).call(this);

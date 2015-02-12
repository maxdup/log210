// Generated by CoffeeScript 1.8.0
(function() {
  angular.module('resto.restoControllers', []).controller('RestaurantController', function($scope, $location, $http, $routeParams) {
    var assign_selection, param;
    param = $routeParams.param;
    $scope.restos = [];
    if ($location.path() === '/admin/resto') {
      $scope.new_resto = {
        'name': '',
        'menu': {},
        'user': ''
      };
      $scope.options = [
        {
          'label': 'None',
          'value': ''
        }
      ];
      $scope.selected_staff = '';
      $http.get('/api/all_staff').success(function(data) {
        var user, _i, _len;
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          user = data[_i];
          $scope.options.push({
            'label': user.email,
            'value': user.pk
          });
        }
        $scope.selected_staff = $scope.options[0];
        return $scope.new_resto.user = $scope.selected_staff.value;
      });
      assign_selection = function(resto) {
        var option, _i, _len, _ref, _results;
        if (resto.user) {
          _ref = $scope.options;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            option = _ref[_i];
            if (option.value === resto.user.pk) {
              _results.push(resto.new_user = option);
            }
          }
          return _results;
        } else {
          return resto.new_user = $scope.options[0];
        }
      };
      $http.get('/api/all_resto').success(function(data) {
        var resto, _i, _len, _ref;
        $scope.restos = data;
        _ref = $scope.restos;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          resto = _ref[_i];
          assign_selection(resto);
        }
        if (param) {
          return $scope.current_resto = ((function() {
            var _j, _len1, _ref1, _results;
            _ref1 = $scope.restos;
            _results = [];
            for (resto = _j = 0, _len1 = _ref1.length; _j < _len1; resto = ++_j) {
              resto = _ref1[resto];
              if (resto.pk === param) {
                _results.push(resto);
              }
            }
            return _results;
          })())[0];
        }
      }).error(function(data) {
        return console.log(data);
      });
      $scope.create_resto = function() {
        return $http.post('/api/create_resto', $scope.new_resto).success(function(data) {
          assign_selection(data);
          $scope.restos.push(data);
          $scope.new_resto = {
            'name': '',
            'menu': {},
            'user': ''
          };
          return alert("il est préferable d'assigner un restaurateur");
        }).error(function(data) {
          return console.log(data);
        });
      };
    } else {
      $http.get('/api/assigned_resto').success(function(data) {
        $scope.restos = data;
        return console.log(data);
      }).error(function(data) {
        return console.log(data);
      });
    }
    $scope.edit_resto = function(resto) {
      resto.backup = _.clone(resto);
      resto.backup.user = _.clone(resto.user);
      if (assign_selection) {
        assign_selection(resto);
      }
      return console.log(resto);
    };
    $scope.save_resto = function(resto) {
      if (resto.user && resto.new_user && resto.new_user.value === resto.user.pk) {
        delete resto['new_user'];
      }
      delete resto['backup'];
      return $http.post('/api/edit_resto', resto).success(function(data) {
        _.extend(resto, data);
        if (!data.user) {
          return alert("il est préferable d'assigner un restaurateur");
        }
      }).error(function(data) {
        return console.log(data);
      });
    };
    $scope.cancel_resto = function(resto) {
      _.extend(resto, resto.backup);
      delete resto['backup'];
      return delete resto['new_user'];
    };
    $scope.delete_resto = function(resto) {
      return $http.post('/api/delete_resto', resto).success(function(data) {
        return $scope.restos = _.without($scope.restos, resto);
      }).error(function(data) {
        return console.log(data);
      });
    };
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
        return menu.newitem = {
          'name': '',
          'desc': '',
          'price': ''
        };
      } else {
        return alert('il faut spécifier un nom et un prix');
      }
    };
    return $scope.save_menu = function() {
      return $http.post('/api/edit_menu', $scope.current_resto).success(function(data) {
        return console.log(data);
      });
    };
  });

}).call(this);

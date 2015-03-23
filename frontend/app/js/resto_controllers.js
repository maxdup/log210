// Generated by CoffeeScript 1.8.0
(function() {
  angular.module('resto.restoControllers', []).controller('HomeController', function($scope, $http, Resto) {
    return $scope.restos = Resto.query();
  }).controller('RestaurantController', function($scope, $location, $http, Profile, Resto) {
    var assign_selection;
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
      Profile.query({
        restaurateur: true
      }).$promise.then(function(value) {
        var profile, _i, _len;
        for (_i = 0, _len = value.length; _i < _len; _i++) {
          profile = value[_i];
          $scope.options.push({
            'label': profile.user.email,
            'value': profile.user.pk
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
      Resto.query().$promise.then(function(value) {
        var resto, _i, _len, _ref, _results;
        $scope.restos = value;
        _ref = $scope.restos;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          resto = _ref[_i];
          _results.push(assign_selection(resto));
        }
        return _results;
      });
      $scope.create_resto = function() {
        if (!$scope.new_resto.user) {
          alert("il est préferable d'assigner un restaurateur");
        }
        return Resto.save($scope.new_resto).$promise.then(function(value) {
          assign_selection(value);
          $scope.restos.push(value);
          return $scope.new_resto = {
            'name': '',
            'menu': {},
            'user': ''
          };
        });
      };
    } else {
      if ($scope.profile) {
        $scope.restos = Resto.query({
          user: $scope.profile.user.pk
        });
      } else {
        $scope.$on('profileload', function() {
          return $scope.restos = Resto.query({
            user: $scope.profile.user.pk
          });
        });
      }
    }
    $scope.edit_resto = function(resto) {
      resto.backup = _.clone(resto);
      resto.backup.user = _.clone(resto.user);
      if (assign_selection) {
        return assign_selection(resto);
      }
    };
    $scope.save_resto = function(resto) {
      if (resto.user && resto.new_user && resto.new_user.value === resto.user.pk) {
        delete resto['new_user'];
      }
      delete resto['backup'];
      return Resto.update({
        id: resto.pk
      }, resto).$promise.then(function(value) {
        _.extend(resto, value);
        if (!value.user) {
          return alert("il est préferable d'assigner un restaurateur");
        }
      });
    };
    $scope.cancel_resto = function(resto) {
      _.extend(resto, resto.backup);
      delete resto['backup'];
      return delete resto['new_user'];
    };
    return $scope.delete_resto = function(resto) {
      return Resto["delete"]({
        id: resto.pk
      }).$promise.then(function(value) {
        return $scope.restos = _.without($scope.restos, resto);
      });
    };
  });

}).call(this);

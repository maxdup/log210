// Generated by CoffeeScript 1.8.0
(function() {
  angular.module('resto.userControllers', ['resto.dev', 'ngCookies', 'gettext']).controller('RootController', function($scope, $location, $http, $route, $rootScope, Profile, conf, $cookies, gettextCatalog) {
    var update_profile;
    $scope.loginform = {
      'username': '',
      'password': ''
    };
    update_profile = function() {
      return Profile.get({
        id: 'self'
      }).$promise.then(function(value) {
        if (value.pk) {
          $scope.profile = value;
          return $rootScope.$broadcast('profileload');
        }
      });
    };
    update_profile();
    $scope.login = function() {
      $scope.$on('profileload', function() {
        $http.defaults.headers.post['X-CSRFToken'] = $cookies['csrftoken'];
        $http.defaults.headers.put['X-CSRFToken'] = $cookies['csrftoken'];
        return $http.defaults.headers.common['X-CSRFToken'] = $cookies['csrftoken'];
      });
      return $http.post(conf.url + 'login', $scope.loginform).success(function(data) {
        $scope.auth = true;
        $scope.loggingin = false;
        $scope.profile = data.profile;
        $scope.username = data.username;
        update_profile();
        return $route.reload();
      });
    };
    $scope.logout = function() {
      return $http.get(conf.url + 'logout').success(function(data) {
        $scope.auth = false;
        $scope.profile = null;
        $scope.loginform['username'] = '';
        $scope.loginform['password'] = '';
        delete $cookies['csrftoken'];
        delete $cookies['sessionid'];
        $location.path("/app/#/home");
        return $route.reload();
      });
    };
    return $scope.changeLanguage = function(lang) {
      gettextCatalog.setCurrentLanguage(lang);
      return gettextCatalog.debug = true;
    };
  }).controller('UserController', function($scope, $location, $http, Profile, Resto) {
    var userform;
    userform = {
      'user': {
        'username': '',
        'email': '',
        'first_name': '',
        'last_name': '',
        'password': ''
      },
      'date_naissance': '',
      'adresse': '',
      'telephone': ''
    };
    _.extend($scope.userform, userform);
    $scope.submit = function(restaurateur) {
      if (restaurateur == null) {
        restaurateur = false;
      }
      $scope.userform.is_restaurateur = restaurateur;
      return Profile.save($scope.userform).$promise.then(function(value) {
        var opt;
        if ($location.path() === '/admin/users') {
          $scope.profiles.push(value);
          if ($scope.userform.resto) {
            Resto.update({
              id: $scope.userform.resto
            }, {
              'pk': $scope.userform.resto,
              'new_user': {
                'value': value.user.pk
              }
            });
            $scope.options = (function() {
              var _i, _len, _ref, _results;
              _ref = $scope.options;
              _results = [];
              for (opt = _i = 0, _len = _ref.length; _i < _len; opt = ++_i) {
                opt = _ref[opt];
                if (opt.value !== $scope.userform.resto) {
                  _results.push(opt);
                }
              }
              return _results;
            })();
            return $scope.selected_resto = $scope.options[0];
          } else {
            return alert("il est preferable d'assigner un restaurant");
          }
        } else {
          alert('registration successful');
          return $location.path("app/#/home");
        }
      });
    };
    if ($location.path() === '/admin/users') {
      $scope.profiles = Profile.query();
      $scope.options = [
        {
          'label': 'None',
          'value': ''
        }
      ];
      $scope.selected_resto = $scope.options[0];
      Resto.query().$promise.then(function(value) {
        var resto, _i, _len, _ref, _results;
        $scope.restos = value;
        $scope.available_resto = (function() {
          var _i, _len, _ref, _results;
          _ref = $scope.restos;
          _results = [];
          for (resto = _i = 0, _len = _ref.length; _i < _len; resto = ++_i) {
            resto = _ref[resto];
            if (resto.user === null) {
              _results.push(resto);
            }
          }
          return _results;
        })();
        _ref = $scope.available_resto;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          resto = _ref[_i];
          _results.push($scope.options.push({
            'label': resto.name,
            'value': resto.pk
          }));
        }
        return _results;
      });
    }
    $scope.edit = function(profile) {
      profile.backup = _.clone(profile);
      return profile.backup.user = _.clone(profile.user);
    };
    $scope.cancel = function(profile) {
      _.extend(profile, profile.backup);
      return delete profile['backup'];
    };
    $scope.save = function(profile) {
      return Profile.update({
        id: profile.user.pk
      }, profile).$promise.then(function(value) {
        return delete profile['backup'];
      });
    };
    return $scope.remove = function(profile) {
      return Profile["delete"]({
        id: profile.user.pk
      }).$promise.then(function(value) {
        return $scope.profiles = _.without($scope.profiles, profile);
      });
    };
  });

}).call(this);

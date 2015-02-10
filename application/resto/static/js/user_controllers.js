// Generated by CoffeeScript 1.8.0
(function() {
  angular.module('resto.userControllers', []).controller('RootController', function($scope, $location, $http) {
    $scope.auth = auth;
    $scope.username = username;
    $scope.loginform = {
      'username': '',
      'password': ''
    };
    $scope.login = function() {
      return $http.post('api/login', $scope.loginform).success(function(data) {
        if (data.success) {
          $scope.auth = true;
          $scope.loggingin = false;
          return $scope.username = data.username;
        }
      }).error(function(data) {
        return console.log(data);
      });
    };
    return $scope.logout = function() {
      return $http.get('/api/logout').success(function(data) {
        $scope.auth = false;
        $scope.loginform['username'] = '';
        return $scope.loginform['password'] = '';
      });
    };
  }).controller('UserController', function($scope, $location, $http) {
    var userform;
    userform = {
      'email': '',
      'first_name': '',
      'last_name': '',
      'date_naissance': '',
      'adresse': '',
      'telephone': '',
      'password': ''
    };
    $scope.userform = {};
    _.extend($scope.userform, userform);
    $scope.submit = function(restaurateur) {
      if (restaurateur == null) {
        restaurateur = false;
      }
      $scope.userform.is_staff = restaurateur;
      return $http.post('/api/register', $scope.userform).success(function(data) {
        if ($location.path() === '/manage/users') {
          $scope.profiles.push(data);
          _.extend($scope.userform, userform);
        } else {
          alert('registration successful');
        }
        return console.log(data);
      }).error(function(data) {
        return console.log(data);
      });
    };
    if ($location.path() === '/manage/users') {
      $http.get('/api/all_profiles').success(function(data) {
        return $scope.profiles = data;
      }).error(function(data) {
        return console.log(data);
      });
      $scope.options = [
        {
          'label': 'None',
          'value': ''
        }
      ];
      $scope.selected_resto = $scope.options[0];
      $http.get('/api/all_resto').success(function(data) {
        var resto, _i, _len, _ref, _results;
        $scope.restos = data;
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
      }).error(function(data) {
        return console.log(data);
      });
    } else {
      $http.get('/api/profile').success(function(data) {
        return $scope.profile = data;
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
      return $http.post('/api/edit_profile', profile).success(function(data) {
        console.log(data);
        return delete profile['backup'];
      });
    };
    return $scope["delete"] = function(profile) {
      return $http.post('/api/delete_profile', profile).success(function(data) {
        return $scope.profiles = _.without($scope.profiles, profile);
      }).error(function(data) {
        return console.log(data);
      });
    };
  });

}).call(this);

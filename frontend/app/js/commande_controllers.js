// Generated by CoffeeScript 1.8.0
(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  angular.module('resto.commandeControllers', ['ui.bootstrap']).controller('CommandeController', function($scope, $http, $routeParams) {
    var param, update_total;
    $scope.form = {};
    param = $routeParams.param;
    $scope.order = {
      'details': {
        'commande': [],
        'addressTo': '',
        'addressFrom': '',
        'requestedTime': new Date()
      },
      'restaurant': param
    };
    $scope.confirm = {};
    $http.get('api/profile').success(function(data) {
      $scope.profile = data;
      return $scope.order.details.addressTo = $scope.profile.adresse[0];
    });
    $http.get('api/all_resto').success(function(data) {
      var resto;
      if (param) {
        $scope.current_resto = ((function() {
          var _i, _len, _results;
          _results = [];
          for (resto = _i = 0, _len = data.length; _i < _len; resto = ++_i) {
            resto = data[resto];
            if (resto.pk === param) {
              _results.push(resto);
            }
          }
          return _results;
        })())[0];
        return $scope.order.details.addressFrom = $scope.current_resto.address;
      }
    });
    $scope.add_item = function(item) {
      if ($scope.sending) {
        $scope.order.details.commande = [];
      }
      $scope.sending = false;
      $scope.confirm = null;
      if (__indexOf.call($scope.order.details.commande, item) >= 0) {
        item.qty += 1;
      } else {
        item.qty = 1;
        $scope.order.details.commande.push(item);
      }
      return update_total();
    };
    $scope.remove_item = function(item) {
      $scope.order.details.commande = _.without($scope.order.details.commande, item);
      return update_total();
    };
    $scope.qty_adjust = function(item, adjustment) {
      item.qty = Math.max(1, item.qty + adjustment);
      return update_total();
    };
    update_total = function() {
      var item, _i, _len, _ref, _results;
      $scope.total = 0;
      _ref = $scope.order.details.commande;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        _results.push($scope.total += item.price * item.qty);
      }
      return _results;
    };
    $scope.place_order = function() {
      if ($scope.auth === true) {
        $scope.sending = true;
        if ($scope.order.details.addressTo === '##new') {
          $scope.profile.adresse.push($scope.new_address);
          $scope.order.details.addressTo = $scope.new_address;
          $http.post('api/edit_profile', $scope.profile).error(function(data) {
            return console.log(data);
          });
        }
        $http.post('api/create_commande', $scope.order).success(function(data) {
          return $scope.confirm = data;
        }).error(function(data) {
          return console.log(data);
        });
        $scope.confirm;
      }
      if ($scope.auth === false) {
        return alert('Veuillez vous connecter');
      }
    };
    $scope.minDate = new Date();
    $scope.hstep = 1;
    $scope.mstep = 15;
    return $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      return $scope.opened = true;
    };
  }).controller('CommandeManageController', function($scope, $http, $location, $routeParams) {
    var directionsDisplay, directionsService, get_route, param;
    param = $routeParams.param;
    $scope.filtered = function(array, filter) {
      var name;
      return (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = array.length; _i < _len; _i++) {
          name = array[_i];
          if (filter.indexOf(name.status) !== -1) {
            _results.push(name);
          }
        }
        return _results;
      })();
    };
    if ($location.path() === '/deliver_commande') {
      directionsService = new google.maps.DirectionsService();
      directionsDisplay = new google.maps.DirectionsRenderer();
      get_route = function() {
        var map, request;
        request = {
          origin: $scope.current_location || $scope.selected_commande.details.addressFrom,
          waypoints: [
            {
              location: $scope.selected_commande.details.addressFrom,
              stopover: true
            }
          ],
          destination: $scope.selected_commande.details.addressTo,
          travelMode: google.maps.TravelMode.DRIVING
        };
        directionsService.route(request, function(response, status) {
          if (status === google.maps.DirectionsStatus.OK) {
            return directionsDisplay.setDirections(response);
          }
        });
        map = new google.maps.Map(document.getElementById('map-canvas'));
        return directionsDisplay.setMap(map);
      };
      $scope.set_selected = function(commande) {
        $scope.selected_commande = commande;
        if ($scope.selected_commande) {
          return get_route();
        }
      };
    }
    $scope.commandes = [];
    $http.post('api/resto_commande', param).success(function(data) {
      return $scope.commandes = data;
    }).error(function(data) {
      return console.log(data);
    });
    return $scope.update_status = function(commande, status) {
      return $http.post('api/update_commande_status', {
        'status': status,
        'commande': commande
      }).success(function(data) {
        commande.details = data.details;
        commande.status = data.status;
        if (__indexOf.call(_.keys(data), 'error') >= 0) {
          return alert('Un autre livreur a déjà livré cette commande');
        }
      }).error(function(data) {
        return console.log(data);
      });
    };
  }).controller('CommandeConfirmController', function($scope, $http, $routeParams) {
    var param;
    param = $routeParams.param;
    $scope.total = 0;
    return $http.post('api/update_commande', {
      'status': 'paid',
      'commande': {
        'pk': param
      }
    }).success(function(data) {
      var item, _i, _len, _ref, _results;
      $scope.confirm = data;
      _ref = $scope.confirm.details.commande;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        _results.push($scope.total += item.price * item.qty);
      }
      return _results;
    });
  });

}).call(this);

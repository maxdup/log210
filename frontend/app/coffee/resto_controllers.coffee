angular.module('resto.restoControllers', [])

.controller 'RestaurantController',
($scope, $location, $http, Resto) ->

  $scope.restos = []

  if $location.path() == '/admin/resto'
    $scope.new_resto = {
      'name': '',
      'menu': {},
      'user': '',
    }

    $scope.options = [{'label':'None', 'value':''}]

    $scope.selected_staff = ''
    $http.get('http://127.0.0.1:8000/api/all_staff')
      .success (data) ->
        for user in data
          $scope.options.push({'label': user.email,'value':user.pk})
        $scope.selected_staff = $scope.options[0]
        $scope.new_resto.user = $scope.selected_staff.value

    assign_selection = (resto) ->
      if resto.user
        resto.new_user = option for option in $scope.options \
        when option.value == resto.user.pk
      else
        resto.new_user = $scope.options[0]

    Resto.query().$promise.then(
      (value) ->
        $scope.restos = value
        for resto in $scope.restos
          assign_selection(resto))

    $scope.create_resto = ->
      if not $scope.new_resto.user
        alert("il est préferable d'assigner un restaurateur")

      Resto.save($scope.new_resto).$promise.then(
        (value) ->
          assign_selection(data)
          $scope.restos.push(data)
          $scope.new_resto = {'name':'', 'menu':{}, 'user':''})

  else
    $scope.$on 'profileload', ->
      $scope.restos = Resto.query({user:$scope.profile.user.pk})

  $scope.edit_resto = (resto) ->
    resto.backup = _.clone(resto)
    resto.backup.user = _.clone(resto.user)
    if assign_selection
      assign_selection(resto)
    console.log(resto)

  $scope.save_resto = (resto) ->
    if (resto.user and resto.new_user and resto.new_user.value == resto.user.pk)
      delete resto['new_user']
    delete resto['backup']

    Resto.update({id:resto.pk}, resto).$promise.then(
      (value) ->
        _.extend(resto, value)
        console.log(value)
        if not value.user
          alert("il est préferable d'assigner un restaurateur"))

  $scope.cancel_resto = (resto) ->
    _.extend(resto, resto.backup)
    delete resto['backup']
    delete resto['new_user']

  $scope.delete_resto = (resto) ->
    Resto.delete({id:resto.pk}).$promise.then(
      (value) ->
        $scope.restos = _.without($scope.restos, resto))
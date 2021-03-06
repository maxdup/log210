angular.module('resto.userControllers', ['resto.dev', 'ngCookies', 'gettext'])

.controller 'RootController',
($scope, $location, $http, $route, $rootScope, Profile, conf, $cookies, gettextCatalog) ->

  $scope.loginform = {
    'username':''
    'password':''
  }
  update_profile = ()->
    Profile.get({id:'self'}).$promise.then(
      (value) ->
        if value.pk
          $scope.profile = value
          $rootScope.$broadcast('profileload')
    )
  update_profile()

  $scope.login = ->
    $scope.$on 'profileload', ->
      $http.defaults.headers.post['X-CSRFToken'] = $cookies['csrftoken']
      $http.defaults.headers.put['X-CSRFToken'] = $cookies['csrftoken']
      $http.defaults.headers.common['X-CSRFToken'] = $cookies['csrftoken']

    $http.post(conf.url + 'login', $scope.loginform)
      .success (data) ->
        $scope.auth = true
        $scope.loggingin = false
        $scope.profile = data.profile
        $scope.username = data.username
        update_profile()
        $route.reload()

  $scope.logout = ->
    $http.get(conf.url + 'logout')
      .success (data) ->
        $scope.auth = false
        $scope.profile = null
        $scope.loginform['username'] = ''
        $scope.loginform['password'] = ''
        delete $cookies['csrftoken']
        delete $cookies['sessionid']
        $location.path( "/app/#/home" )
        $route.reload()

  $scope.changeLanguage = (lang) ->
    gettextCatalog.setCurrentLanguage(lang)
    gettextCatalog.debug = true


.controller 'UserController',
($scope, $location, $http, Profile, Resto) ->

  userform = {
    'user':{
      'username':''
      'email':'',
      'first_name': '',
      'last_name': '',
      'password': ''}
    'date_naissance': '',
    'adresse': '',
    'telephone': '',
  }

  _.extend($scope.userform, userform)

  $scope.submit = (restaurateur=false) ->
    $scope.userform.is_restaurateur = restaurateur
    Profile.save($scope.userform).$promise.then(
      (value) ->
        if $location.path() == '/admin/users'
          $scope.profiles.push(value)
          if $scope.userform.resto
            Resto.update({id:$scope.userform.resto},
              {'pk': $scope.userform.resto,
              'new_user': {'value':value.user.pk}})
            $scope.options =
              (opt for opt, opt in $scope.options \
                when opt.value != $scope.userform.resto)
            $scope.selected_resto = $scope.options[0]
          else
            alert("il est preferable d'assigner un restaurant")
        else
          alert('registration successful')
          $location.path("app/#/home"))


  if $location.path() == '/admin/users'

    $scope.profiles = Profile.query()
    $scope.options = [{'label':'None', 'value':''}]
    $scope.selected_resto = $scope.options[0]

    Resto.query().$promise.then(
      (value) ->
        $scope.restos = value
        $scope.available_resto =
          (resto for resto, resto in $scope.restos \
            when resto.user == null)
        for resto in $scope.available_resto
          $scope.options.push({'label':resto.name, 'value':resto.pk}))
 
  $scope.edit = (profile) ->
    profile.backup = _.clone(profile)
    profile.backup.user = _.clone(profile.user)

  $scope.cancel = (profile) ->
    _.extend(profile, profile.backup)
    delete profile['backup']

  $scope.save = (profile) ->
    Profile.update({id:profile.user.pk}, profile).$promise.then(
      (value) ->
        delete profile['backup'])

  $scope.remove = (profile) ->
    Profile.delete(id:profile.user.pk).$promise.then(
      (value) ->
        $scope.profiles = _.without($scope.profiles, profile))

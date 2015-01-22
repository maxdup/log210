angular.module('resto.restoControllers', [])
.controller('RestaurantController', ($scope, $location, $http) ->
  $http.get('/api/all_staff')
    .success((data) ->
      console.log(data)
    )
  $scope.staff_available = [
    {label:'okay', value:'pk'},
    {label:'okay2', value:'pk2'}]

  $scope.selected_staff = $scope.staff_available[0]
    
  $scope.new_resto = {
    'name': '',
    'restaurateur': $scope.staff_available[1],
    'name': '',
  }
)
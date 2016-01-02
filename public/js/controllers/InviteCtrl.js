angular.module('InviteCtrl', []).controller('InviteCtrl', ['$scope', '$http' , function($scope, $http) {

    var randomRoomNumber = Math.floor(1000 + Math.random() * 9000);

    $scope.doSomething = function() {
        $http.post('/invite', { someData: 'hello world'})
            .then(function success(response){
                console.log('email sent ' + response.data);
            }, function failure(response){
                console.log('email failed ' + response);
            });
    };



}]);
angular.module('InviteCtrl', []).controller('InviteCtrl', ['$scope', '$http' , function($scope, $http) {

    var randomRoomNumber = Math.floor(1000 + Math.random() * 9000);

    $scope.mockTableData =
        [
            {
                userImage: ***REMOVED***
                name: ***REMOVED***
                department: 'DEFRA'
            },

            {
                userImage: ***REMOVED***
                name: ***REMOVED***,
                department: ***REMOVED***
            },

            {
                userImage: ***REMOVED***
                name: ***REMOVED***,
                department: ***REMOVED***
            }
        ];


    $scope.doSomething = function() {
        $http.post('/invite', { roomNumber: randomRoomNumber})
            .then(function success(response){
                console.log('email sent ' + response.data);
            }, function failure(response){
                console.log('email failed ' + response);
            });
    };



}]);
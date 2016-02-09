angular.module('InviteCtrl', ['ui.bootstrap']).controller('InviteCtrl', ['$scope', '$http', function($scope, $http) {

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


    $scope.sendInvite = function() {
        $http.post('/invite', { roomNumber: randomRoomNumber})
            .then(function success(response){
                console.log('email sent ' + response.data);
            }, function failure(response){
                console.log('email failed ' + response);
            });
    };


    //Calendar functions

    $scope.today = function() {
        $scope.date = new Date();
    };

    $scope.today();

    $scope.cal = {
        opened: false
    };

    $scope.openCalendar = function() {
        $scope.cal.opened = true;
    };


    //Time functions

    var myTime = new Date();
    myTime.setHours(12);
    myTime.setMinutes(00);

    $scope.time = myTime;

    $scope.hourStep = 1;
    $scope.minuteStep = 15;



}]);
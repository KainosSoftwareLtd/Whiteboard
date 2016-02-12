angular.module('InviteCtrl', ['ui.bootstrap']).controller('InviteCtrl', ['$scope', '$http', function($scope, $http) {

    var MAX_INVITEES = 4;
    $scope.randomRoomNumber = Math.floor(1000 + Math.random() * 9000);
    $scope.invitees = [];
    $scope.search = '';

    $scope.mockTableData =
        [
            {
                id: 1,
                userImage: ***REMOVED***
                name: ***REMOVED***
                department: 'DEFRA'
            },

            {
                id: 2,
                userImage: ***REMOVED***
                name: ***REMOVED***,
                department: ***REMOVED***
            },

            {
                id: 3,
                userImage: ***REMOVED***
                name: ***REMOVED***,
                department: ***REMOVED***
            }
        ];


    $scope.sendInvite = function() {
        $http.post('/invite',
            {
                roomNumber: $scope.randomRoomNumber,
                invitees: $scope.invitees,
                time: $scope.time,
                date: $scope.date

            })
            .then(function success(response){
                console.log('email sent ' + response.data);
            }, function failure(response){
                console.log('email failed ' + response);
            });
    };
    
    $scope.addUserToInviteesList = function(user) {
        var i = angular.toJson(user);
        if($scope.invitees.length < MAX_INVITEES){
            removeUserFromTable(user.id);
            $scope.invitees.push(JSON.parse(i));
        }
    };

    function removeUserFromTable(id) {
        for(var i = 0; i < $scope.mockTableData.length; i++){
            if($scope.mockTableData[i].id === id){
                $scope.mockTableData.splice(i,1);
            }
        }
    }


    $scope.removeUserFromInviteesList = function(user) {
        for(var i = 0; i < $scope.invitees.length; i++) {
            if($scope.invitees[i].name === user.name){
                $scope.invitees.splice(i,1);
                addUserToTable(user);
            }
        }
    };

    function addUserToTable(user) {
        $scope.mockTableData.push(user);
    }

    $scope.clearSearch = function() {
        $scope.search = '';
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

    $scope.time = myTime.getTime();

    $scope.hourStep = 1;
    $scope.minuteStep = 15;



}]);
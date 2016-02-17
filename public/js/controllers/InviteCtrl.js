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
            },

            {
                id: 4,
                userImage: ***REMOVED***
                name: ***REMOVED***,
                department: ***REMOVED***
            },

            {
                id: 5,
                userImage: ***REMOVED***
                name: ***REMOVED***,
                department: ***REMOVED***
            },

            {
                id: 6,
                userImage: ***REMOVED***
                name: ***REMOVED***,
                department: ***REMOVED***
            }
        ];


    $scope.sendInvite = function() {
        compileStartDate();
        $http.post('/invite',
            {
                roomNumber: $scope.randomRoomNumber,
                invitees: $scope.invitees,
                endTime: $scope.endTime,
                date: $scope.date

            })
            .then(function success(response){
                console.log('email sent ' + response.data);
            }, function failure(response){
                console.log('email failed ' + response);
            });
    };

    function compileStartDate(){
        return $scope.date.setTime($scope.startTime);
    }

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

    $scope.minDate = $scope.minDate ? null : new Date();

    $scope.today();

    $scope.cal = {
        opened: false
    };

    $scope.openCalendar = function() {
        $scope.cal.opened = true;
    };


    //Time functions

    var myStartTime = new Date();
    myStartTime.setHours(12);
    myStartTime.setMinutes(0);
    myStartTime.setSeconds(0);
    myStartTime.setMilliseconds(0);

    var myEndTime = new Date();
    myEndTime.setHours(12);
    myEndTime.setMinutes(15);
    myEndTime.setSeconds(0);
    myEndTime.setMilliseconds(0);

    $scope.startTime = myStartTime;
    $scope.endTime = myEndTime;

    $scope.hourStep = 1;
    $scope.minuteStep = 15;


    //Stop users entering an end time that is before the start time
    $scope.changed = function() {
        if($scope.endTime <= $scope.startTime){
            var d = new Date();

            d.setHours($scope.startTime.getHours());
            d.setMinutes($scope.startTime.getMinutes() + 15);
            d.setSeconds(0);
            d.setMilliseconds(0);

            $scope.endTime = d;
        }
    }

}]);
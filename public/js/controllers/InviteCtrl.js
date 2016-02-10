angular.module('InviteCtrl', ['ui.bootstrap']).controller('InviteCtrl', ['$scope', '$http', function($scope, $http) {

    $scope.randomRoomNumber = Math.floor(1000 + Math.random() * 9000);
    $scope.invitees = [];
    $scope.search = '';

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

    function clearInvitees(){
        $scope.invitees = [];
    }


    $scope.add = function(invitee) {
        var i = angular.toJson(invitee);
        if($scope.invitees.length < 3){
            $scope.invitees.push(JSON.parse(i));
        }
    };

    $scope.remove = function(invitee) {
        for(var i = 0; i < $scope.invitees.length; i++) {
            if($scope.invitees[i].name === invitee.name){
                $scope.invitees.splice(i,1);
            }
        }
    };

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
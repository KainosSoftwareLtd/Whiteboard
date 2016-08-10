angular.module('InviteCtrl', ['ui.bootstrap']).controller('InviteCtrl', ['$scope', '$http', function($scope, $http) {

    var MAX_INVITEES = 4;
    $scope.randomRoomNumber = Math.floor(1000 + Math.random() * 9000);
    $scope.invitees = [];
    $scope.search = '';
    $scope.alerts = [];

    $scope.mockTableData =
        [
            {
                id: 1,
                userImage: 'http://placehold.it/150x150',
                name: '**ADD CONTACT HERE**',
                department: '**ADD CONTATCT HERE**',
                email: '**ADD CONTACT HERE**'
            },

            {
                id: 2,
                userImage: 'http://placehold.it/150x150',
                name: '**ADD CONTACT HERE**',
                department: '**ADD CONTATCT HERE**',
                email: '**ADD CONTACT HERE**'
            },

            {
                id: 3,
                userImage: 'http://placehold.it/150x150',
                name: '**ADD CONTACT HERE**',
                department: '**ADD CONTATCT HERE**',
                email: '**ADD CONTACT HERE**'
            },

            {
                id: 4,
                userImage: 'http://placehold.it/150x150',
                name: '**ADD CONTACT HERE**',
                department: '**ADD CONTATCT HERE**',
                email: '**ADD CONTACT HERE**'
            },

            {
                id: 5,
                userImage: 'http://placehold.it/150x150',
                name: '**ADD CONTACT HERE**',
                department: '**ADD CONTATCT HERE**',
                email: '**ADD CONTACT HERE**'
            },

            {
                id: 6,
                userImage: 'http://placehold.it/150x150',
                name: '**ADD CONTACT HERE**',
                department: '**ADD CONTATCT HERE**',
                email: '**ADD CONTACT HERE**'
            },
        ];


    $scope.sendInvite = function() {
        if(isInviteesEmpty()){
            addAlert('danger', 'You need to add at least 1 user');
        } else {
            $http.post('/invite',
                {
                    roomNumber: $scope.randomRoomNumber,
                    invitees: $scope.invitees,
                    emailAddresses: getInviteesEmailAddresses(),
                    startDate: $scope.startDate,
                    endDate: $scope.endDate
                })
                .then(function success(response){
                    addAlert('success', 'Your invite has been sent successfully');
                    console.log('email sent ' + response.data);
                }, function failure(response){
                    addAlert('danger', 'Something went wrong, Please try again');
                    console.log('email failed ' + response);
                });
        }
    };

    function isInviteesEmpty(){
        return $scope.invitees <= 0;
    }


    function getInviteesEmailAddresses(){
        var emailAddresses = [];

        for(var i = 0; i < $scope.invitees.length; i++){
            emailAddresses.push($scope.invitees[i].email)
        }

        return emailAddresses;
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
        $scope.startDate = new Date();
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

    $scope.startDate.setHours(12);
    $scope.startDate.setMinutes(0);
    $scope.startDate.setSeconds(0);
    $scope.startDate.setMilliseconds(0);


    $scope.endDate = new Date();
    $scope.endDate.setTime($scope.startDate.getTime());
    $scope.endDate.setMinutes(15);


    $scope.hourStep = 1;
    $scope.minuteStep = 15;


    //Stop users entering an end time that is before the start time
    $scope.changed = function() {
        if($scope.endDate <= $scope.startDate){
            var d = new Date();

            d.setDate($scope.startDate.getDate());
            d.setHours($scope.startDate.getHours());

            d.setSeconds(0);
            d.setMilliseconds(0);

            d.setTime($scope.startDate.getTime());
            d.setMinutes($scope.startDate.getMinutes() + 15);

            $scope.endDate = d;

        }
    };

    $scope.dateChanged = function() {
        $scope.endDate.setTime($scope.startDate.getTime());
    };

    //Uialert functions

    function addAlert(type, message) {
        $scope.alerts.push({type:type, msg: message});
    }

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

}]);
describe('Invite Controller', function () {

    beforeEach(module('InviteCtrl'));

    var $controller, $httpBackend;

    var mockTableTestData =
        [
            {
                id: 1,
                userImage: ***REMOVED***
                name: ***REMOVED***
                department: ***REMOVED***
                email: '***REMOVED***'
            },

            {
                id: 2,
                userImage: ***REMOVED***
                name: ***REMOVED***,
                department: ***REMOVED***,
                email: '***REMOVED***'
            },

            {
                id: 3,
                userImage: ***REMOVED***
                name: ***REMOVED***,
                department: ***REMOVED***,
                email: '***REMOVED***'
            },

            {
                id: 4,
                userImage: ***REMOVED***
                name: ***REMOVED***,
                department: ***REMOVED***,
                email: '***REMOVED***'
            },

            {
                id: 5,
                userImage: ***REMOVED***
                name: ***REMOVED***,
                department: ***REMOVED***,
                email: '***REMOVED***'
            },

            {
                id: 6,
                userImage: ***REMOVED***
                name: ***REMOVED***,
                department: ***REMOVED***,
                email: '***REMOVED***'
            }
        ];

    //REF:https://docs.angularjs.org/guide/unit-testing
    beforeEach(inject(function(_$controller_, $injector){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
        $httpBackend = $injector.get('$httpBackend');
    }));

    describe('Invite Controller unit tests', function(){
        var $scope, controller;

        beforeEach(function(){
            $scope = {};
            controller = $controller('InviteCtrl', { $scope: $scope });
        });


        it('Should randomly generate a random room number between 0 and 9999', function() {
            expect($scope.randomRoomNumber).toBeGreaterThan(0);
            expect($scope.randomRoomNumber).toBeLessThan(10000);
        });

        it('$scope.clearSearch() should set the search bar to an empty string', function(){
            $scope.search = 'a string to search for';
            $scope.clearSearch();

            expect($scope.search).toBe('');
        });

        describe('Adding and removing of invitees', function(){

            it('$scope.addUserToInviteesList() Should only allow a maximum of 4 invitees to be added', function(){
                $scope.addUserToInviteesList(mockTableTestData[0]);
                $scope.addUserToInviteesList(mockTableTestData[1]);
                $scope.addUserToInviteesList(mockTableTestData[2]);
                $scope.addUserToInviteesList(mockTableTestData[3]);
                $scope.addUserToInviteesList(mockTableTestData[4]);
                $scope.addUserToInviteesList(mockTableTestData[5]);
                $scope.addUserToInviteesList(mockTableTestData[0]);
                $scope.addUserToInviteesList(mockTableTestData[2]);

                expect($scope.invitees.length).toBe(4);

            });

            it('$scope.addUserToInviteesList() Should add the specified user to the invitee list and remove them from the table', function(){
                $scope.addUserToInviteesList(mockTableTestData[0]);

                expect($scope.invitees.length).toBe(1);
                expect($scope.invitees).toContain(mockTableTestData[0]);
                expect($scope.mockTableData).not.toContain(mockTableTestData[0]);
            });

            it('$scope.removeUserFromInviteesList() should remove the specified user from the invitee list and add them back to the table', function(){
                $scope.addUserToInviteesList = mockTableTestData[1];

                $scope.removeUserFromInviteesList(mockTableTestData[1]);

                expect($scope.invitees).not.toContain(mockTableTestData[1]);
                expect($scope.mockTableData).toContain(mockTableTestData[1]);
            });

        });
        describe('Time and Date functions', function() {

            it('Should set the end time to 15 minutes ahead of the start time', function(){
                expect($scope.endDate.getMinutes()).toEqual($scope.startDate.getMinutes() + 15);
            });


            it('$scope.changed should not allow an end time to be set before a start time', function(){
                $scope.endDate = new Date();
                $scope.startDate = new Date();

                $scope.endDate.setTime($scope.startDate.getTime());
                $scope.endDate.setHours($scope.startDate.getHours() - 2);

                $scope.changed();

                expect($scope.endDate).not.toBeLessThan($scope.startDate);

            });

            it('$scope.changed should set the end time to be 15 minutes ahead of the start time if the ' +
                'end time is changed to 15 minutes within 15 minutes of the start time', function(){

                $scope.endDate = new Date();
                $scope.startDate = new Date();

                $scope.endDate.setTime($scope.startDate.getTime());

                $scope.changed();

                expect($scope.endDate.getMinutes()).toEqual($scope.startDate.getMinutes() + 15);

            });
        });

        describe('Invite sending tests', function(){

            it('Should call the /invite POST request', function(){
                $scope.addUserToInviteesList(mockTableTestData[1]);
                $httpBackend.whenPOST('/invite').respond(200);

                $scope.sendInvite();

                $httpBackend.flush();
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });

        });
    });

});
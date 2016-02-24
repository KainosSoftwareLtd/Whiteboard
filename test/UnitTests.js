describe('Invite Controller', function () {

    beforeEach(module('InviteCtrl'));

    var $controller;

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
    beforeEach(inject(function(_$controller_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
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


        it('should..', function(){

        });

        it('should..', function(){

        });

        it('should..', function(){

        });

        it('should..', function(){

        });

        it('should..', function(){

        });

    });

});
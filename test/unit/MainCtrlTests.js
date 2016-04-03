describe('Main Controller', function(){

    beforeEach(module('MainCtrl'));

    var $controller;

    //REF:https://docs.angularjs.org/guide/unit-testing
    beforeEach(inject(function(_$controller_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
    }));

    var $scope, controller;

    beforeEach(function(){
        $scope = {};
        controller = $controller('MainController', { $scope: $scope });
    });


    it('Should be initialised with an empty input field and the create meeting button disabled', function(){
        expect($scope.inputField).toBe('');
        expect($scope.buttonDisabled).toBeTruthy();
    });

    it('$scope.addNumberToDisplay() should clear the room number and start again when a room number higher ' +
        'than 4 digits is entered', function(){
        $scope.addNumberToDisplay('1');
        $scope.addNumberToDisplay('2');
        $scope.addNumberToDisplay('3');
        $scope.addNumberToDisplay('4');
        $scope.addNumberToDisplay('5');

        expect($scope.inputField).toBe('5');

    });

    it('$scope.addNumberToDisplay() should enable the join meeting button when 4 digits have been entered', function(){
        $scope.addNumberToDisplay('1');
        $scope.addNumberToDisplay('2');
        $scope.addNumberToDisplay('3');
        $scope.addNumberToDisplay('4');

        expect($scope.buttonDisabled).toBeFalsy();
    });


});
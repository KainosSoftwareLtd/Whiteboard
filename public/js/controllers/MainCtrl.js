angular.module('MainCtrl', []).controller('MainController', function($scope, $location) {

    $scope.inputField = '';
    $scope.buttonDisabled = true;


    $scope.go = function() {
        $location.path('/board/' + $scope.inputField);
    };

    $scope.createNewMeeting = function() {

    };

    $scope.addNumberToDisplay = function(num) {

        if($scope.inputField.length > 3){
            $scope.inputField = '';
        }

        if($scope.inputField.length == 3) {
            $scope.buttonDisabled = false;
        } else {
            $scope.buttonDisabled = true;
        }

        $scope.inputField += num;
    };

});
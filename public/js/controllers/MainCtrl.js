angular.module('MainCtrl', []).controller('MainController', function($scope, $window) {

    $scope.inputField = '';
    $scope.buttonDisabled = true;


    $scope.go = function() {
        $window.location.href = '/board/' + $scope.inputField;
    };

    $scope.newMeeting = function () {
        $window.location.href = '/invite/';
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
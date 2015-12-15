angular.module('whiteboard', [])
    .controller('MainController', ['$scope', function($scope) {
        $scope.username = 'World';
        console.log("gagag");
        $scope.sayHello = function() {
            $scope.greeting = 'Hello ' + $scope.username + '!';
            console.log($scope.greeting);
        };
    }]).config(function ($interpolateProvider) {
        $interpolateProvider.startSymbol('{[{');
        $interpolateProvider.endSymbol('}]}');
    });
angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', '$interpolateProvider', function($routeProvider, $locationProvider, $interpolateProvider) {

    $routeProvider

        // home page
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'MainController'
        })

        .when('/test', {
            templateUrl: 'views/test.html',
            controller: 'TestCtrl'
        });

    $locationProvider.html5Mode(true);
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');

}]);
angular.module('AppConfig', []).config(['$locationProvider', '$interpolateProvider', function($locationProvider, $interpolateProvider) {

    $locationProvider.html5Mode(true);
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');

}]);
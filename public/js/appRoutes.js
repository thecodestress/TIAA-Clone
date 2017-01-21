angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'MainController'
        })
        .when('/tiaamongo', {
            templateUrl: 'views/TIAADashboard.html',
            controller: 'TiaaMongoController'
        })
        .when('/tiaafirebase', {
            templateUrl: 'views/TIAADashboard.html',
            controller: 'TiaaFirebaseController'
        })
        .when('/tiaacouch', {
            templateUrl: 'views/TIAADashboard.html',
            controller: 'TiaaCouchController'
        })
        .otherwise({
            redirectTo: '/'
        });

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

}]);

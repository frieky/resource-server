angular.module('oauth', [ 'ngRoute' ])
    .config(function($routeProvider, $httpProvider) {

        $routeProvider.when('/', {
            templateUrl : 'home.html',
            controller : 'auth'
        }).when('/login', {
            templateUrl : 'login.html',
            controller : 'navigation'
        }).otherwise('/');

    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

    })
    .controller('auth', function($scope, $http) {
        var params = credentials ? { username: credentials.username, password: credentials.password } : {};
        var headers = credentials ? { authorization : "Basic " + btoa(credentials.username + ":" + credentials.password) } : {};

        if (credentials)
            console.log("Requesting (auth) authentication for " + credentials.username);
        else
            console.log("Requesting (auth) authentication for no one!");

        $http.post('/resource/api/user/login', {
            data: params,
            headers: headers
        }).success(function(data) {
            $scope.ui = data;
        })
    })
    .controller('navigation', function($rootScope, $scope, $http, $location, $route) {
        $scope.tab = function(route) {
            return $route.current && $route === $route.current.controller;
        }

        var authenticate = function(credentials, callback) {

            var headers = credentials ? { authorization : "Basic " + btoa(credentials.username + ":" + credentials.password) } : {};
            var params = credentials ? { username: credentials.username, password: credentials.password } : {};

            if (credentials)
                console.log("Requesting authentication for " + credentials.username);
            else
                console.log("Requesting authentication for no one!");
            $http.get('user', {
                headers : headers

            }).success(function(data) {
                if (data.username) {
                    $rootScope.auth = data;
                    $rootScope.authenticated = true;
                } else {
                    $rootScope.authenticated = false;
                }
                callback && callback();
            }).error(function() {
                $rootScope.authenticated = false;
                callback && callback();
            });

            console.log("Authentication complete.")

        }

        authenticate();

        $scope.credentials = {};
        $scope.login = function() {
            authenticate($scope.credentials, function() {
                if ($rootScope.authenticated) {
                    console.log("Login successful")
                    $location.path("/");
                    $scope.error = false;
                    $rootScope.authenticated = true;
                } else {
                    console.log("Login failed")
                    $location.path("/login");
                    $scope.error = true;
                    $rootScope.authenticated = false;
                }
            })
        };
        $scope.logout = function() {
            $http.post('logout', {}).success(function() {
                $rootScopt.authenticated = false;
                $location.path("/");
            }).error(function(data) {
                console.log("Logout failed")
                $rootScope.authenticated = false;
            });
        }
    });

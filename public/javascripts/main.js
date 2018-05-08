var app = angular.module("myApp", ["ngRoute","ngAnimate", "ngSanitize"]);

app.config(function($routeProvider) {
    $routeProvider

    .when('/', {
        templateUrl: 'route_templates/route-home.html',
        controller: 'ctrlMain'
    })
    .when('/home', {
        templateUrl: 'route_templates/route-home.html',
        controller: 'ctrlMain'
    })
    .when('/info', {
        templateUrl: 'route_templates/route-info.html',
        controller: 'ctrlMain'
    })
    .when('/schedule', {
        templateUrl: 'route_templates/route-schedule.html',
        controller: 'ctrlMain'
    })
    .when('/things-to-do', {
        templateUrl: 'route_templates/route-things-to-do.html',
        controller: 'ctrlMain'
    })
    .when('/registry', {
        templateUrl: 'route_templates/route-registry.html',
        controller: 'ctrlMain'
    })
    .when('/rsvp', {
        templateUrl: 'route_templates/route-rsvp.html',
        controller: 'ctrlMain'
    });
});



app.controller("ctrlMain", function($scope,ajaxFetch, angularStore) {
    $scope.menuChange = window.location.hash.replace(/#\//g,'');
    if(angularStore.getContent('copy') === null) {
        ajaxFetch.getData('/getContent')
            .then(function (res) {
                angularStore.setContent('copy', res.data);
                $scope.copy = res.data;
            });
    }

});






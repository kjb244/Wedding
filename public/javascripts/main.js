var app = angular.module("myApp", ["ngRoute","ngAnimate"]);

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
    .when('/story', {
        templateUrl: 'route_templates/route-story.html',
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
    .when('/rsvp', {
        templateUrl: 'route_templates/route-rsvp.html',
        controller: 'ctrlMain'
    });
});



app.controller("ctrlMain", function($scope,ajaxFetch ) {
    $scope.menuChange = window.location.hash.replace(/#\//g,'');
    if(!document.querySelector('body').classList.contains('content-loaded')) {
        ajaxFetch.getData('/getContent')
            .then(function (res) {
                $scope.copy = res.data;
                document.querySelector('body').classList.add('content-loaded');
            });
    }



});






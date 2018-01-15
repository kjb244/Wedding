var app = angular.module("myApp", ["ngRoute", "ngAnimate"]);





app.controller("ctrlMain", function($scope,ajaxFetch ) {
    $scope.menuChange = 'Home';
    ajaxFetch.getData('/getContent')
        .then(function(res) {
            $scope.copy = res.data;
        });

});






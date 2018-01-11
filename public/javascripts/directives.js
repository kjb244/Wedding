

app.directive('navBarDir', function(){
  return {
    restrict: 'EA',
    scope: false,
    templateUrl: 'directive_templates/nav-bar.html',
    link: function($scope, elem, attrs){
    },
    controller: function($scope){

    }
  };
});



app.directive('rsvpDir', function(){
    return {
        restrict: 'EA',
        scope: true,
        templateUrl: 'directive_templates/rsvp.html',
        link: function($scope, elem, attrs){
            $scope.rsvpFormArray = [{firstName: '', lastName: ''}];

        },
        controller: function($scope){
          $scope.addAnotherPerson = function(){
            if ($scope.rsvpFormArray.length === 1){
                $scope.rsvpFormArray.push({firstName: '', lastName: ''});
            }
          }

          $scope.checkFormStatus = function(){


          }
        }
    };
});


app.directive('testingDir', function(){
    return {
        restrict: 'EA',
        scope: true,
        template: '<h3>hi</h3>',
        link: function(scope, elem, attrs){

        }
    };
});


app.directive("houseProgressDir", function(){
  return{
    restrict: "EA",
    scope: {
      progress: "="
    },
    templateUrl: 'directive_templates/house-progress.html',
    link: function(scope, element, attrs) {
      scope.$watch('progress', function(newValue, oldValue){
        newValue = newValue || 0;
        angular.element(element[0].querySelector('.structure-fill')).css('height', newValue + "px");
      });
      
    }
  };

});


app.directive("chapterOneSectionOneDir", function(ajaxFetch) {
  return {
    restrict: "EA", //E = element, A = attribute, C = class, M = comment
    scope: true,
    templateUrl: 'directive_templates/chapter-one-section-one.html',

    link: function($scope, element, attrs) {
      ajaxFetch.getData($scope.currRoute.init).then(function(res) {
        $scope.form = res.data[0];
        $scope.showSpinner = false;
      });
    }
  };
});

app.directive("chapterOneSectionTwoDir", function(ajaxFetch) {
  return {
    restrict: "EA", //E = element, A = attribute, C = class, M = comment
    scope: true,
    templateUrl: 'directive_templates/nav-bar.html',

    link: function($scope, element, attrs) {
      ajaxFetch.getData($scope.currRoute.init).then(function(res) {
        $scope.form = res.data[0];
        $scope.showSpinner = false;
      });
    }
  };
});

app.directive("chapterOneSectionThreeDir", function(ajaxFetch) {
  return {
    restrict: "EA", //E = element, A = attribute, C = class, M = comment
    scope: true,
    templateUrl: 'directive_templates/chapter-one-section-three.html',

    link: function($scope, element, attrs) {
      ajaxFetch.getData($scope.currRoute.init).then(function(res) {
        $scope.form = res.data[0];
        $scope.showSpinner = false;
      });
    }
    
  };
});
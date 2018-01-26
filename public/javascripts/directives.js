

app.directive('navBarDir', function($timeout){
  return {
    restrict: 'EA',
    scope: false,
    templateUrl: 'directive_templates/nav-bar.html',
    link: function($scope, elem, attrs){

    },
    controller: function($scope){
        $scope.menuChangeClick = function(inp){
            var oldMenu = $scope.menuChange;
            $scope.menuChange = inp;
            if(oldMenu === inp) return;
            var body = document.querySelector('body');
            body.classList.add('hide-scroll');
            $timeout(function(){
                body.classList.remove('hide-scroll');
            },700);
        }

    }
  };
});

app.directive('storyCardsDir', function(){
    return {
        restrict: 'EA',
        scope: false,
        templateUrl: 'directive_templates/story-cards.html',
        link: function($scope, elem, attrs){
        },
        controller: function($scope){


        }
    };
});

app.directive('scheduleDir', function($timeout){
    return {
        restrict: 'EA',
        scope: true,
        templateUrl: 'directive_templates/schedule.html',
        link: function($scope, elem, attrs){
        },
        controller: function($scope){
            $scope.currIndex = 0;
            $scope.showHideNode = function(idx){
                return $scope.currIndex === idx;
            }
            $scope.subMenuClick = function(idx){
                $scope.currIndex = idx;

            }

        }
    };
});


app.directive('cardsWithMapDir', function(utilityFunctions){
    return {
        restrict: 'EA',
        scope: false,
        templateUrl: 'directive_templates/cards-with-map.html',
        link: function($scope, elem, attrs){
            $scope.googleMapMarkers = [];

            var map;
            var markers = [];

            function autoCenter() {
                //  Create a new viewpoint bound
                var bounds = new google.maps.LatLngBounds();
                var origin = [35.2212875,-80.8456213];
                //  Go through each...
                for (var i = 0; i < markers.length; i++) {
                    var latDiff = Math.abs(markers[i].position.lat() - origin[0]);
                    var longDiff = Math.abs(markers[i].position.lng() - origin[1]);

                    bounds.extend(markers[i].position);
                }
                //  Fit these bounds to the map
                map.fitBounds(bounds);
            }

            function loadGoogleMaps(){
                var locations = [
                    ['US National White Water Center', 35.2725889,-81.0075044],
                    ['7th Street Market', 35.224351,-80.840249],
                    ['Nascar Hall of Fame', 35.2212875,-80.8456213],
                    ['Sycamore Brewery', 35.208721,-80.864947]
                ];

                map = new google.maps.Map(document.getElementById('map'), {
                    //zoom: 13,
                    zoom: 12,
                    center: new google.maps.LatLng(35.229628,-80.896094),
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    zoomControlOptions: {
                        position: google.maps.ControlPosition.LEFT_BOTTOM
                    }
                });

                var infowindow = new google.maps.InfoWindow();

                var marker, i;

                for (i = 0; i < locations.length; i++) {
                    marker = new google.maps.Marker({
                        position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                        map: map
                    });
                    $scope.googleMapMarkers.push(marker);
                    markers.push(marker);

                    google.maps.event.addListener(marker, 'click', (function(marker, i) {
                        return function() {
                            infowindow.setContent(locations[i][0]);
                            infowindow.open(map, marker);

                        }
                    })(marker, i));
                }




            }

            loadGoogleMaps();
            setTimeout(function(){
                window.dispatchEvent(new Event('resize'));
                autoCenter();
            },500);

            /*var mapY = null;
            var scrollMap = utilityFunctions.debounce(function(){
                var ua = window.navigator.userAgent;

                var mapEl = document.querySelector('#map');
                var posY = window.scrollY;
                if (mapY == null) mapY = utilityFunctions.getPosition(document.querySelector('#map')).y;
                var posDiff = posY - mapY;
                if (posDiff > 0){
                    mapEl.style['margin-top'] =  posDiff + 'px';
                }
                else{
                    mapEl.style['margin-top'] =  '0';
                }
            },0);
            window.addEventListener('scroll', scrollMap);*/



        },
        controller: function($scope){
            $scope.hoverOnCard = function(idx){
                var currMarker = $scope.googleMapMarkers[idx];
                google.maps.event.trigger(currMarker, 'click');
            }

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


app.directive('navBarDir', function($timeout){
  return {
    restrict: 'EA',
    scope: false,
    templateUrl: 'directive_templates/nav-bar.html',
    link: function($scope, elem, attrs){
        setTimeout(function(){ $(document).foundation()},200);
    },
    controller: function($scope){
        $scope.menuChangeClick = function(route){
            var as = document.querySelector('.animate-switch');
            $('#offCanvasLeft').foundation('close');
            window.location.hash = '#/' + route;
            //as.style.minHeight = window.innerHeight + 10 + 'px';
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

app.directive('infoDir', function(){
    return {
        restrict: 'EA',
        scope: false,
        templateUrl: 'directive_templates/info.html',
        link: function($scope, elem, attrs){
        },
        controller: function($scope, $sce, angularStore){
            var copy = angularStore.getContent('copy');
            copy = copy.routes.info;
            $scope.trustIframe = [];
            copy.content.map(function(e){
                if (e.iframe){
                    $scope.trustIframe.push($sce.trustAsHtml(e.iframe));
                }
            });
            $scope.iframeCntr = -1;
            $scope.countInit = function(){
                return ++$scope.iframeCntr;
            }


        }
    };
});

app.directive('modalOverlayDir', function($timeout){
    return {
        restrict: 'EA',
        scope: false,
        templateUrl: 'directive_templates/modal-overlay.html',
        link: function($scope, elem, attrs){
            $scope.showModal = false;
            $timeout(function(){
                if(window.location.origin.indexOf('localhost') > -1){
                    document.querySelector('body .overlay').classList.add('hidden');
                    document.querySelector('body').classList.remove('hide-scroll')
                    return true;
                }

                document.querySelector('body').classList.add('hide-scroll');
                $scope.showModal=true;
                
            },1000);

        },
        controller: function($scope){
            $scope.inputs = [];
            $scope.submitModal = function(){
                if ($scope.inputs[0] === 'test') {
                    document.querySelector('body .overlay').classList.add('hidden');
                    document.querySelector('body').classList.remove('hide-scroll');
                    $scope.showModal=false;
                }
            }

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


app.directive('registryDir', function(){
    return {
        restrict: 'EA',
        scope: true,
        templateUrl: 'directive_templates/registry.html',
        link: function($scope, elem, attrs){
        
        },
        controller: function($scope){
        
        }
    };
});



app.directive('cardsWithMapDir', function(angularStore, utilityFunctions, $timeout){
    return {
        restrict: 'EA',
        scope: false,
        templateUrl: 'directive_templates/cards-with-map.html',
        link: function($scope, elem, attrs){
            var copy = angularStore.getContent('copy');
            copy = copy.routes.thingsToDo;
            var screenSize = utilityFunctions.screenSize();
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
                var locations = [];
                var userZoomed = false;
                copy.cards.map(function(data){
                    var arr = [];
                    arr.push(data.heading.text);
                    arr.push(data.googleLatLong[0]);
                    arr.push(data.googleLatLong[1]);
                    arr.push(data.googleZoomOut || false);
                    locations.push(arr);
                });
                //add in hotel
                locations.push(['Holiday Inn', '35.227039', '-80.839813', false]);



                map = new google.maps.Map(document.getElementById('map'), {
                    //zoom: 13,
                    zoom: 13,
                    center: new google.maps.LatLng(35.2196305,-80.8381841),
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    zoomControlOptions: {
                        position: google.maps.ControlPosition.LEFT_BOTTOM
                    }
                });

                $scope.map = map;

                //once user clicks on zoom icons then set flag
                google.maps.event.addListenerOnce(map, 'mousemove', function(){
                    google.maps.event.addListener(map, 'zoom_changed', function(){
                        if(!$scope.hoveringOnCard && !userZoomed){
                            userZoomed = true;
                        }
                        
                    });

                  });

                var infowindow = new google.maps.InfoWindow();

                var marker, i;

                function pinSymbol(color) {
                    return {
                        path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
                        fillColor: color,
                        fillOpacity: 1,
                        strokeColor: '#000',
                        strokeWeight: 2,
                        scale: 1,
                    };
                }

                for (i = 0; i < locations.length; i++) {
                    var mapObj = {
                        position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                        map: map,
                        title: locations[i][0]
                    }
                    if(locations[i][0].indexOf('Holiday') > -1) {
                        mapObj.icon = pinSymbol('#00FF1A');
                    }
                    marker = new google.maps.Marker(mapObj);
                    $scope.googleMapMarkers.push(marker);
                    markers.push(marker);

                    google.maps.event.addListener(marker, 'click', (function(marker, i) {
                        return function() {

                            setTimeout(function () {
                                
                                var currentBounds = map.getBounds();
                                var point = new google.maps.LatLng(locations[i][1], locations[i][2]);
                                var containedInWindow = currentBounds.contains(point);
                                var zoomOut = locations[i][3];
                                infowindow.setContent(locations[i][0]);
                                infowindow.open(map, marker);
                                //if user has zoomed it then don't mess with zoom level
                                if (userZoomed) return false;
                                //if zoomOut then set zoom level
                                if(zoomOut){
                                    if(screenSize === 'small' || screenSize === 'medium'){
                                        map.setZoom(10);
                                    }
                                    else{
                                        map.setZoom(11);
                                    }
                                }
                                //else set to default
                                else{
                                    map.setZoom(14);
                                }

                                //point not in window then recenter
                                if(!containedInWindow){
                                    map.setCenter(marker.getPosition());
                                }
                                //hovering is done
                                $scope.hoveringOnCard = false;
                 
                            },0);

                        }
                    })(marker, i));
                }
            }

            loadGoogleMaps();
            setTimeout(function(){
                window.dispatchEvent(new Event('resize'));
                //autoCenter();
            },500);

            $timeout(function(){
                var firstCard = document.querySelector('.cards');
                var firstCardTop;
                if(!angularStore.getContent('cardTop')){
                    angularStore.setContent('cardTop', firstCard.getBoundingClientRect().top);
                }
                firstCardTop = angularStore.getContent('cardTop');

                function scrollMove(){
                    if(screenSize === 'small') return false;
                    var st = window.pageYOffset || document.documentElement.scrollTop;
                    var map = document.querySelector('.map-wrapper');
                    if(!map) return false;
                    if(st > firstCardTop){
                        map.classList.add('custom');
                    }
                    else{
                        map.classList.remove('custom');
                    }
                }



                window.addEventListener('scroll', scrollMove);


                //window.addEventListener('touchmove', scrollMove);
                //window.addEventListener('touchstart', scrollMove);

            },1);

        },
        controller: function($scope){
            $scope.hoverOnCard = function(header){
                var currMarker = $scope.googleMapMarkers.filter(function(rec){
                    return rec.title === header;
                })[0];
                $scope.hoveringOnCard = true;
                google.maps.event.trigger(currMarker, 'click');
            }

            $scope.showLocationDropDown = false;
            $scope.showFoodTypeDropDown = false;

            $scope.updateActivity = function(){
                var sc = $scope;
                sc.showLocationDropDown = false;
                sc.showFoodTypeDropDown = false;
                if (sc.activityDropDown === 'Beer'){
                    sc.showLocationDropDown = true;
                }
                else if (sc.activityDropDown === 'Food'){
                    sc.showFoodTypeDropDown = true;
                }

                //if we aren't showing location dropdown then clear all polygons drawn
                if(!sc.showLocationDropDown && $scope.lastPolygonMap){
                    $scope.lastPolygonMap.setMap(null);
                }
                //if we are showing location dropdown and our select list has been touched
                //previously then draw polygon on map
                else if(sc.showLocationDropDown && $scope.lastPolygonMap){
                    var map = $scope.map;
                    $scope.lastPolygonMap.setMap(map);
                }
            }


            $scope.activityDropDownFilter = function(rec){
                if(!$scope.activityDropDown) return true;
                return rec.type.toLowerCase() === $scope.activityDropDown.toLowerCase();
            }

            $scope.locationDropDownFilter = function(rec){
                if(!$scope.activityDropDown) return true;
                if ($scope.activityDropDown.toLowerCase() === 'beer'){
                    if($scope.locationDropDown){
                        return rec.location.toLowerCase() === $scope.locationDropDown.toLowerCase();
                    }
                }
                return true;
            }

            $scope.foodTypeDropDownFilter = function(rec){
                if(!$scope.activityDropDown) return true;
                if ($scope.activityDropDown.toLowerCase() === 'food'){
                    if($scope.foodTypeDropDown){
                        return rec.foodType.toLowerCase() === $scope.foodTypeDropDown.toLowerCase();
                    }
                }
                return true;
            }

            $scope.locationChange = function(){
                var map = $scope.map;
                var location = $scope.locationDropDown;
                var colors = {
                    strokeColor: '#bfbfda',
                    strokeOpacity: 0.8,
                    strokeWeight: 3,
                    fillColor: '#bfbfda',
                    fillOpacity: 0.35
                };
                var paths = {
                    southend: {paths: [
                            {lat: 35.220600, lng: -80.857803},
                            {lat: 35.187370, lng: -80.881721},
                            {lat: 35.203827, lng: -80.858633},
                            {lat: 35.213925, lng: -80.848986}
                        ]},
                    noda: {paths: [
                            {lat: 35.234829, lng: -80.829981},
                            {lat: 35.230728, lng: -80.826462},
                            {lat: 35.249860, lng: -80.792480},
                            {lat: 35.251578, lng: -80.808531}
                        ]},
                    plaza: {paths: [
                            {lat: 35.224697, lng: -80.820816},
                            {lat: 35.222397, lng: -80.794380},
                            {lat: 35.217980, lng: -80.796440},
                            {lat: 35.220785, lng: -80.821245}
                        ]}
                };

                var polygonObj;
                var pathMatch = Object.keys(paths).filter(function(el){
                    return el.toLowerCase().indexOf(location.toLowerCase()) > -1 ||
                        location.toLowerCase().indexOf(el.toLowerCase()) > -1;
                })

                if(pathMatch.length){
                    polygonObj = angular.extend({}, colors, paths[pathMatch[0]]);
                }

                //clear last drawing
                if($scope.lastPolygonMap){
                    $scope.lastPolygonMap.setMap(null);
                }

                //if we haven't mapped the polygon to a location then exit
                if(!pathMatch.length){
                    return false;
                }

                //draw on map
                var polygonMap = new google.maps.Polygon(polygonObj);
                polygonMap.setMap(map);
                //store last entry
                $scope.lastPolygonMap = polygonMap;
            }

        }
    };
});

app.directive('spinnerOverlayDir', function(){
    return {
        restrict: 'EA',
        scope: {
            toggle: '='
        },
        link: function($scope, elem, attrs){
            var spinnerOverlay = document.createElement('div');
            spinnerOverlay.setAttribute('data','spinner-overlay');
            spinnerOverlay.classList.add('hide');
            spinnerOverlay.style.cssText = 'top: 0; position: fixed; height: 100%; background-color: gray; width: 100%; opacity: .7';
            document.body.appendChild(spinnerOverlay);

            var spinnerOverlaySpinner = document.createElement('div');
            spinnerOverlaySpinner.setAttribute('data','spinner-modal');
            spinnerOverlaySpinner.classList.add('hide');
            spinnerOverlaySpinner.style.cssText = 'height: 100%; position: fixed; top: 0; left: 0; width: 100%;';
            var spinnerOverlaySpinnerChild = document.createElement('div');
            spinnerOverlaySpinnerChild.innerHTML = '<div class="wrapper" style="margin: auto; width: 80%; background-color: white; padding: 30px; border-radius: 5px; "><div class="loader"></div><div class="loading-text" style="text-align: center; margin-top: 10px;">Loading...</div></div></div>';
            spinnerOverlaySpinnerChild.style.cssText = 'position: absolute; width:100%; color: #7676d0';
            spinnerOverlaySpinner.appendChild(spinnerOverlaySpinnerChild);
            document.body.appendChild(spinnerOverlaySpinner);


        },
        controller: function($scope){

            $scope.$watch('toggle', function(newVal){
                var spinnerModal = document.querySelector('[data="spinner-modal"]');
                var spinnerOverlay = document.querySelector('[data="spinner-overlay"]');
                var spinnerLoadingText = spinnerModal.querySelector('.loading-text');
                if (spinnerModal === null || spinnerOverlay === null) return false;
                if (newVal === true){
                    spinnerModal.classList.remove('hide');
                    spinnerOverlay.classList.remove('hide');
                    //add in animation class
                    spinnerLoadingText.classList.add('loading-text-animation');
                    var windowHeight = window.innerHeight;
                    var wrapperHeight = document.querySelector('[data="spinner-modal"] .wrapper').clientHeight;
                    var topPos = (windowHeight - wrapperHeight) /2;
                    document.querySelector('[data="spinner-modal"] .wrapper').parentNode.style.top = topPos + 'px';

                }
                else{
                    spinnerModal.classList.add('hide');
                    spinnerOverlay.classList.add('hide');
                    spinnerLoadingText.classList.remove('loading-text-animation');
                }
            });


        }
    };
});


app.directive('rsvpDir', function(ajaxFetch, utilityFunctions, $timeout){
    return {
        restrict: 'EA',
        scope: true,
        templateUrl: 'directive_templates/rsvp.html',
        link: function($scope, elem, attrs){
            $scope.formData = {};
            $scope.formData.email = null;
            $scope.formData.rsvpFormArray = [];
            $scope.toggleSpinner = false;

        },
        controller: function($scope){

          $scope.checkboxChanged = function(idx){
              var formArr = $scope.formData.rsvpFormArray;
              var currElem = formArr[idx];
              if (formArr.length > 1 && formArr[0].attending === false ){
                  $scope.formData.rsvpFormArray[1].attending = false;
              }
              formArr.map(function(e){
                  if(!e.attending){
                      e.dietaryRestrictions = null;
                  }
              })
          }
          $scope.submitData = function(){
              $scope.toggleSpinner = true;
              $timeout(function() {
                  ajaxFetch.getData('/submitRSVPData', 'POST', $scope.formData)
                      .then(function (res) {
                          $scope.toggleSpinner = false;
                          if (res.data.rowsUpdated) {
                              $scope.invitationComplete = true;
                              utilityFunctions.scrollTop();
                          }
                      })
              },1000);
          }

          $scope.lookupByEmail = function(){
            var email = $scope.formData.email;
            $scope.toggleSpinner = true;
            $scope.emailNotFound = false;
            $timeout(function(){
                ajaxFetch.getData('/lookupByEmail', 'GET', {email: email})
                    .then(function(res) {
                        $scope.toggleSpinner = false;
                        $scope.formData.rsvpFormArray = [];
                        if (!res.data.length) $scope.emailNotFound = true;
                        res.data.map(function(e){
                            if (e.dateUpdate) $scope.invitationComplete = true;
                            $scope.formData.rsvpFormArray.push(
                                {firstName: e.firstName,
                                    lastName: e.lastName,
                                    attending: e.attending,
                                    dietaryRestrictions: e.dietaryRestrictions,
                                    readOnly: (e.firstName || '').length > 0 && (e.lastName || '').length > 0
                                }
                            )
                        })
                    });

            },1500);


          }
        }
    };
});




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
            $scope.menuClick = !$scope.menuClick;
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

                $scope.showModal=true;
                document.querySelector('body').classList.add('hide-scroll');
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


app.directive('cardsWithMapDir', function(angularStore, utilityFunctions){
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

                var infowindow = new google.maps.InfoWindow();

                var marker, i;

                for (i = 0; i < locations.length; i++) {
                    var mapObj = {
                        position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                        map: map,
                        title: locations[i][0]
                    }
                    if(locations[i][0].indexOf('Holiday') > -1) {
                        mapObj.icon = {
                            url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
                            scaledSize: new google.maps.Size(40, 40), // scaled size

                        }
                    }
                    marker = new google.maps.Marker(mapObj);
                    $scope.googleMapMarkers.push(marker);
                    markers.push(marker);

                    google.maps.event.addListener(marker, 'click', (function(marker, i) {
                        return function() {

                            setTimeout(function () {
                                map.setCenter(marker.getPosition())
                                infowindow.setContent(locations[i][0]);
                                infowindow.open(map, marker);
                                if(locations[i][3] ){
                                    if(screenSize === 'small' || screenSize === 'medium'){
                                        map.setZoom(10);
                                    }
                                    else{
                                        map.setZoom(11);
                                    }
                                }
                                else{
                                    map.setZoom(14);
                                }
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

            elem.ready(function(){
                var firstCard = document.querySelector('.cards');
                var firstCardTop = firstCard.getBoundingClientRect().top;

                function scrollMove(){
                    if(screenSize === 'small') return false;
                    var st = window.pageYOffset || document.documentElement.scrollTop;
                    var map = document.querySelector('.map-wrapper');
                    if(st > firstCardTop){
                        map.classList.add('custom');
                    }
                    else{
                        map.classList.remove('custom')
                    }
                }

                window.addEventListener('scroll', scrollMove);
                window.addEventListener('touchmove', function(){
                    var to = 0;
                    for(var i=0; i<20; i++){
                        setTimeout(function(){
                            scrollMove();
                        },to);
                        to+= 100;
                    }
                })

            })



        },
        controller: function($scope){
            $scope.hoverOnCard = function(header){
                var currMarker = $scope.googleMapMarkers.filter(function(rec){
                    return rec.title === header;
                })[0];
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
            spinnerOverlaySpinnerChild.innerHTML = '<div class="wrapper" style="margin: auto; width: 80%; background-color: white; padding: 30px; border-radius: 5px; "><div class="loader"></div></div>';
            spinnerOverlaySpinnerChild.style.cssText = 'position: absolute; width:100%; color: #7676d0';
            spinnerOverlaySpinner.appendChild(spinnerOverlaySpinnerChild);
            document.body.appendChild(spinnerOverlaySpinner);


        },
        controller: function($scope){

            $scope.$watch('toggle', function(newVal){
                var spinnerModal = document.querySelector('[data="spinner-modal"]');
                var spinnerOverlay = document.querySelector('[data="spinner-overlay"]');
                if (spinnerModal === null || spinnerOverlay === null) return false;
                if (newVal === true){
                    spinnerModal.classList.remove('hide');
                    spinnerOverlay.classList.remove('hide');
                    var windowHeight = window.innerHeight;
                    var wrapperHeight = document.querySelector('[data="spinner-modal"] .wrapper').clientHeight;
                    var topPos = (windowHeight - wrapperHeight) /2;
                    document.querySelector('[data="spinner-modal"] .wrapper').parentNode.style.top = topPos + 'px';

                }
                else{
                    spinnerModal.classList.add('hide');
                    spinnerOverlay.classList.add('hide');

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
              ajaxFetch.getData('/submitRSVPData', 'POST', $scope.formData)
                  .then(function(res){
                    if (res.data.rowsUpdated) {
                        $scope.invitationComplete = true;
                        utilityFunctions.scrollTop();
                    }
                  })
          }

          $scope.lookupByEmail = function(){
            var email = $scope.formData.email;
            $scope.toggleSpinner = true;
            $timeout(function(){
                ajaxFetch.getData('/lookupByEmail', 'GET', {email: email})
                    .then(function(res) {
                        $scope.toggleSpinner = false;
                        $scope.formData.rsvpFormArray = [];
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


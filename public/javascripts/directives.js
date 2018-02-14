

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

app.directive('modalOverlayDir', function($timeout){
    return {
        restrict: 'EA',
        scope: false,
        templateUrl: 'directive_templates/modal-overlay.html',
        link: function($scope, elem, attrs){
            $timeout(function(){
                $scope.showModal=true;
                document.querySelector('body').classList.add('hide-scroll');
            },500);
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

app.directive('spinnerOverlayDir', function(){
    return {
        restrict: 'EA',
        scope: {
            toggle: '='
        },
        /*template: [
            '<div spinner-overlay ng-show="displayOverlay" style="height: 100%; position: fixed; top: 0; left: 0; width: 100%;">',
                '<div style="position: absolute; left: 50%; top: 200px; color: #7676d0">',
                    '<i class="fa fa-3x fa-spin fa-circle-o-notch"></i>',
                '</div>',
            '</div>'
        ].join(','),*/
        link: function($scope, elem, attrs){
            var spinnerOverlay = document.createElement('div');
            spinnerOverlay.classList.add('spinner-overlay-dir');
            spinnerOverlay.classList.add('hide');
            spinnerOverlay.style.cssText = 'top: 0; position: fixed; height: 100%; background-color: gray; width: 100%; opacity: .7';
            document.body.appendChild(spinnerOverlay);

            var spinnerOverlaySpinner = document.createElement('div');
            spinnerOverlaySpinner.classList.add('spinner-overlay-spinner-dir');
            spinnerOverlaySpinner.classList.add('hide');
            spinnerOverlaySpinner.style.cssText = 'height: 100%; position: fixed; top: 0; left: 0; width: 100%;';
            var spinnerOverlaySpinnerChild = document.createElement('div');
            spinnerOverlaySpinnerChild.innerHTML = '<div class="wrapper" style="margin: auto; width: 80%; background-color: white; padding: 20px; border-radius: 5px; "><div class="loader"></div></div>';
            spinnerOverlaySpinnerChild.style.cssText = 'position: absolute; width:100%; top: 200px; color: #7676d0';
            spinnerOverlaySpinner.appendChild(spinnerOverlaySpinnerChild);
            document.body.appendChild(spinnerOverlaySpinner);
        },
        controller: function($scope){
            $scope.$watch('toggle', function(newVal, oldVal){
                if(newVal == true){
                    document.querySelector('.spinner-overlay-spinner-dir').classList.remove('hide');
                    document.querySelector('.spinner-overlay-dir').classList.remove('hide');
                }
                else{
                    document.querySelector('.spinner-overlay-spinner-dir').classList.add('hide');
                    document.querySelector('.spinner-overlay-dir').classList.add('hide');

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
              if (formArr.length > 1 && formArr[0].attending === false ){
                  $scope.formData.rsvpFormArray[1].attending = false;
              }
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


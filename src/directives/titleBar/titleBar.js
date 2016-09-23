/*
 * titleBar.js
 *
 * The MIT License (MIT)
 *
 */

/**
 * @ngdoc overview
 * @name directives.titleBar
 * @description An empty module description. Please fill in a high level description of this module.
 */
angular.module( 'spiral9.directives.titleBar', [
    'ngTouch',
    'spiral9.filters.makeSafeHTML',
    'spiral9.services.GoogleMapService',
    'spiral9.services.ForecastService'
] )

/**
 * @ngdoc directive
 * @name titleBar
 * @restrict E
 * @element ANY
 * @description Displays a background image at random (1 of scope.imageCount)
 */
    .directive( 'titleBar', function titleBarDirective( GoogleMapService, ForecastService ) {
        var CN = 'titleBarDirective';

        return {
            restrict : 'E',
            replace : true,
            templateUrl : 'titleBar/titleBar.tpl.html',
            scope : {},
            link : function titleBarDirectiveLink( scope, element, attrs ) {
                scope.GoogleMapService = GoogleMapService;

                scope.areControlsDisplayed = false;

                scope.toggleControlsDisplay = function toggleControlsDisplay(){
                    scope.areControlsDisplayed = !scope.areControlsDisplayed;
                };

                scope.controlBtnClicked = function controlBtnClicked(){
                    scope.toggleControlsDisplay();
                };

                scope.commitBtnClicked = function commitBtnClicked(){
                    scope.toggleControlsDisplay();
                    var city = element[0].querySelector( '#city' ).value;
                    var state = element[0].querySelector( '#state' ).value;

                    element[0].querySelector( '#city' ).value = '';
                    element[0].querySelector( '#state' ).value = '';

                    if( !city ||
                        !state ||
                        ( city.toLowerCase() === GoogleMapService.location.city.toLowerCase() && state.toLowerCase() === GoogleMapService.location.state.toLowerCase() ) ){
                        console.error( "Bad or duplicate/existing city-and-state." );
                        return;
                    }

                    GoogleMapService.getLocation( city, state )
                        .then(
                            function newLocationReceived( loc ){
                                ForecastService.getForecast( loc.lat, loc.lon );
                            },
                            function newLocationFailed( error ){
                                console.error( error );
                            } );
                };

                scope.init = function init(){

                };

                scope.$evalAsync( scope.init );
            }
        };
    } );

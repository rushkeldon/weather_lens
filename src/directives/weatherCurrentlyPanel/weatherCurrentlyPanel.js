/*
 * weatherCurrentlyPanel.js
 *
 * The MIT License (MIT)
 *
 */

/**
 * @ngdoc overview
 * @name directives.weatherCurrentlyPanel
 * @description An empty module description. Please fill in a high level description of this module.
 */
angular.module( 'spiral9.directives.weatherCurrentlyPanel', [
    'ngTouch',
    'spiral9.services.ForecastService'
] )

/**
 * @ngdoc directive
 * @name weatherCurrentlyPanel
 * @restrict E
 * @element ANY
 * @description Displays a background image at random (1 of scope.imageCount)
 */
    .directive( 'weatherCurrentlyPanel', function weatherCurrentlyPanelDirective( ForecastService ) {
        var CN = 'weatherCurrentlyPanelDirective';

        return {
            restrict : 'E',
            replace : true,
            templateUrl : 'weatherCurrentlyPanel/weatherCurrentlyPanel.tpl.html',
            scope : {},
            link : function weatherCurrentlyPanelDirectiveLink( scope, element, attrs ) {
                scope.ForecastService = ForecastService;

                // reference : http://climate.umn.edu/snow_fence/components/winddirectionanddegreeswithouttable3.htm
                scope.getCardinalDirection = function getCardinalDirection( degrees ){
                    // console.log( CN + ".getCardinalDirection" );
                    var dir = "";
                    switch( true ){
                        case ( degrees === null || degrees === undefined ) :
                            // noop
                            break;
                        case ( degrees >= 348.75 && degrees <=  11.25 ) :
                            dir = 'N';
                            break;
                        case ( degrees >= 11.25  && degrees <= 33.75 ) :
                            dir = 'NNE';
                            break;
                        case ( degrees >= 33.75  && degrees <= 56.25 ) :
                            dir = 'NE';
                            break;
                        case ( degrees >= 56.25  && degrees <= 78.75 ) :
                            dir = 'ENE';
                            break;
                        case ( degrees >= 78.75  && degrees <= 101.25 ) :
                            dir = 'E';
                            break;
                        case ( degrees >= 101.25 && degrees <=  123.75 ) :
                            dir = 'ESE';
                            break;
                        case ( degrees >= 123.75 && degrees <=  146.25 ) :
                            dir = 'SE';
                            break;
                        case ( degrees >= 146.25 && degrees <=  168.75 ) :
                            dir = 'SSE';
                            break;
                        case ( degrees >= 168.75 && degrees <=  191.25 ) :
                            dir = 'S';
                            break;
                        case ( degrees >= 191.25 && degrees <=  213.75 ) :
                            dir = 'SSW';
                            break;
                        case ( degrees >= 213.75 && degrees <=  236.25 ) :
                            dir = 'SW';
                            break;
                        case ( degrees >= 236.25 && degrees <=  258.75 ) :
                            dir = 'WSW';
                            break;
                        case ( degrees >= 258.75 && degrees <=  281.25 ) :
                            dir = 'W';
                            break;
                        case ( degrees >= 281.25 && degrees <=  303.75 ) :
                            dir = 'WNW';
                            break;
                        case ( degrees >= 303.75 && degrees <=  326.25 ) :
                            dir = 'NW';
                            break;
                        case ( degrees >= 326.25 && degrees <=  348.75 ) :
                            dir = 'NNW';
                            break;
                        default :
                            console.error( 'ERROR : encountered an unhandled case : degrees :' + degrees + ':' );
                            break;
                    }
                    return dir;
                };

                scope.init = function init(){

                };

                scope.$evalAsync( scope.init );
            }
        };
    } );

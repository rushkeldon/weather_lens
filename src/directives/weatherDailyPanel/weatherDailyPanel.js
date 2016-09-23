/*
 * weatherDailyPanel.js
 *
 * The MIT License (MIT)
 *
 */

/**
 * @ngdoc overview
 * @name directives.weatherDailyPanel
 * @description An empty module description. Please fill in a high level description of this module.
 */
angular.module( 'spiral9.directives.weatherDailyPanel', [
    'ngTouch',
    'spiral9.filters.makeSafeHTML',
    'spiral9.services.ForecastService',
    'spiral9.services.GoogleMapService',
    'spiral9.services.SignalTowerService'
] )

/**
 * @ngdoc directive
 * @name weatherDailyPanel
 * @restrict E
 * @element ANY
 * @description Displays the 5 day forecast
 */
    .directive( 'weatherDailyPanel', function weatherDailyPanelDirective( $timeout, ForecastService, GoogleMapService, SignalTowerService ) {
        var CN = 'weatherDailyPanelDirective';

        return {
            restrict : 'E',
            replace : true,
            templateUrl : 'weatherDailyPanel/weatherDailyPanel.tpl.html',
            scope : {},
            link : function weatherDailyPanelDirectiveLink( scope, element, attrs ) {

                var weekdays = [
                  'SUN',
                  'MON',
                  'TUE',
                  'WED',
                  'THU',
                  'FRI',
                  'SAT'
                ];

                scope.fiveDays = [ 0, 1, 2, 3, 4 ];

                scope.ForecastService = ForecastService;

                scope.newForecastReceived = function newForecastReceived( newForecast ) {
                    console.log( CN + ".newForecastReceived" );
                    console.log( '\tnewForecast : ', newForecast );

                    $timeout( function(){
                        // noop
                    } );
                };

                scope.getWeekDay = function getWeekDay( dayInfo ){
                    if( !dayInfo ){ return ''; }
                    return weekdays[ dayInfo.time.getDay() ];
                };

                scope.init = function init(){
                    // subscribe to new forecasts
                    SignalTowerService.subscribeToSignal( 'signalNewForecastReceived',scope.newForecastReceived, scope );
                    // if we have a forecast now then display it
                    if( ForecastService.forecast.success ){
                        scope.newForecastReceived( ForecastService.forecast );
                    } else {
                        console.log( CN + ' has no forecast yet...' );
                    }
                };

                scope.$evalAsync( scope.init );
            }
        };
    } );

angular.module( 'spiral9.services.ForecastService', [
        'restangular',
        'spiral9.services.SignalTowerService'
    ] )
    .service( 'ForecastService', function ForecastService( $q, Restangular, SignalTowerService ) {
        var CN = 'ForecastService';

        // private service
        var _forecastService = {
            apiKey : '075e757f0e07ee1b1f7980376e01cf86',
            API : null,
            cachedForecast : null,
            retryCount : 0,
            retryLimit : 3,
            // Seattle is the defaultLocation
            defaultLocation : {
                lat : '47.6062095',
                lon : '-122.3320708'
            },
            defaultForecast : {
                "success": false,
                "lat": "0",
                "lon": "0",
                "currently": {
                    "time": 1474422862000,
                    "summary": "pending...",
                    "icon": "hourglass",
                    "nearestStormDistance": 0,
                    "nearestStormBearing": 0,
                    "precipIntensity": 0,
                    "precipProbability": 0,
                    "temperature": 0,
                    "apparentTemperature": 0,
                    "dewPoint": 0,
                    "humidity": 0,
                    "windSpeed": 0,
                    "windBearing": 0,
                    "visibility": 0,
                    "cloudCover": 0,
                    "pressure": 0,
                    "ozone": 0
                },
                "minutely": {
                    "summary": "pending...",
                    "icon": "hourglass",
                    "data": []
                },
                "hourly": {
                    "summary": "pending...",
                    "icon": "hourglass",
                    "data": []
                },
                "daily": {
                    "summary": "pending...",
                    "icon": "hourglass",
                    "data": []
                }
            },
            init : function init(){
                Restangular.setBaseUrl( 'https://api.forecast.io/' );
                Restangular.setJsonp( true );
                Restangular.setDefaultRequestParams( 'jsonp', { callback: 'JSON_CALLBACK' } );
                _forecastService.API = Restangular.one( 'forecast/' + _forecastService.apiKey );
            },
            getDateFromSeconds : function getDateFromSeconds( utcSeconds ) {
                var newDate = new Date();
                if( !utcSeconds ){ return newDate; }
                newDate.setUTCSeconds( utcSeconds );
                return newDate;
            },
            convertTime : function convertTime( dataArray ){
                if( !dataArray ){ return; }
                var i;
                for( i=0; i<dataArray.length; i++ ){
                    if( dataArray[ i ].time ){
                        dataArray[ i ].time = _forecastService.getDateFromSeconds( dataArray[ i ].time );
                    }
                    if( dataArray[ i ].sunriseTime ){
                        dataArray[ i ].sunriseTime = _forecastService.getDateFromSeconds( dataArray[ i ].sunriseTime );
                    }
                    if( dataArray[ i ].sunsetTime ){
                        dataArray[ i ].sunsetTime = _forecastService.getDateFromSeconds( dataArray[ i ].sunsetTime );
                    }
                    if( dataArray[ i ].temperatureMinTime ){
                        dataArray[ i ].temperatureMinTime = _forecastService.getDateFromSeconds( dataArray[ i ].temperatureMinTime );
                    }
                    if( dataArray[ i ].temperatureMaxTime ){
                        dataArray[ i ].temperatureMaxTime = _forecastService.getDateFromSeconds( dataArray[ i ].temperatureMaxTime );
                    }
                    if( dataArray[ i ].apparentTemperatureMinTime ){
                        dataArray[ i ].apparentTemperatureMinTime = _forecastService.getDateFromSeconds( dataArray[ i ].apparentTemperatureMinTime );
                    }
                    if( dataArray[ i ].apparentTemperatureMaxTime ){
                        dataArray[ i ].apparentTemperatureMaxTime = _forecastService.getDateFromSeconds( dataArray[ i ].apparentTemperatureMaxTime );
                    }
                }
            },
            normalize : function normalize( forecastData, lat, lon ){

                // TODO : other failure cases?
                if( !forecastData ){
                    return {
                        success : false
                    };
                }

                var normalized = {
                    success : true,
                    lat : lat,
                    lon : lon,
                    currently : forecastData.currently,
                    minutely : forecastData.minutely,
                    hourly : forecastData.hourly,
                    daily : forecastData.daily
                };


                normalized.currently.time = _forecastService.getDateFromSeconds( normalized.currently.time );

                _forecastService.convertTime( normalized.minutely.data );

                _forecastService.convertTime( normalized.hourly.data );

                _forecastService.convertTime( normalized.daily.data );

                return normalized;
            }
        };

        // public service
        var forecastService = {
            forecast : null,
            /**
             * @ngdoc method
             * @name spiral9.services.ForecastService#getForecast
             * @methodOf spiral9.services.ForecastService
             * @description Returns a promise that will resolve to the forecast for the provided lat, lon.<br/>
             * @returns {Promise}
             */
            getForecast : function getForecast( lat, lon ){
                _forecastService.init();
                var deferred = $q.defer();

                function failed( error ){
                    // TODO : retry logic here
                    deferred.reject( error );
                }

                _forecastService.API
                    .one( lat + ',' + lon )
                    .get()
                    .then(
                        function forecastReceived( forecastData ) {
                            forecastService.forecast = _forecastService.normalize( forecastData, lat, lon );

                            if( forecastService.forecast.success ){
                                console.log( '\tforecastService.forecast : ', forecastService.forecast );
                                deferred.resolve( forecastService.forecast );
                                SignalTowerService.dispatchSignal( 'signalNewForecastReceived', forecastService.forecast );
                            } else {

                                failed( { msg : 'ERROR : received bad data' } );
                            }
                        },
                        function forecastFailed( error ) {
                            failed( error );
                        } );

                return deferred.promise;
            },
            setDefaultLocation : function setDefaultLocation( lat, lon ){
                _forecastService.defaultLocation.lat = lat;
                _forecastService.defaultLocation.lon = lon;
            },
            reset : function reset(){
                forecastService.forecast = angular.copy( _forecastService.defaultForecast );
            }
        };

        // init
        forecastService.reset();
        SignalTowerService.createSignal( 'signalNewForecastReceived' );
        forecastService.getForecast( _forecastService.defaultLocation.lat, _forecastService.defaultLocation.lon );

        // export public service
        return forecastService;
    } );

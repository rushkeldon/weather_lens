angular.module( 'spiral9.services.GoogleMapService', [
        'restangular'
    ] )
    .service( 'GoogleMapService', function GoogleMapService( $q, Restangular ) {
        var CN = 'GoogleMapService';

        // private service
        var _googleMapService = {
            apiKey : 'AIzaSyBfLOA5oS2BBPdmw-82LZsBZ1MrnetOynU',
            API : null,
            retryCount : 0,
            retryLimit : 3,
            // Seattle is the defaultLocation
            defaultCityState : {
                city : 'seattle',
                state : 'wa'
            },
            defaultLocation : {
                "address_components" : [
                    {
                        "long_name" : "Seattle",
                        "short_name" : "Seattle",
                        "types" : [ "locality", "political" ]
                    },
                    {
                        "long_name" : "King County",
                        "short_name" : "King County",
                        "types" : [ "administrative_area_level_2", "political" ]
                    },
                    {
                        "long_name" : "Washington",
                        "short_name" : "WA",
                        "types" : [ "administrative_area_level_1", "political" ]
                    },
                    {
                        "long_name" : "United States",
                        "short_name" : "US",
                        "types" : [ "country", "political" ]
                    }
                ],
                "formatted_address" : "Seattle, WA, USA",
                "geometry" : {
                    "bounds" : {
                        "northeast" : {
                            "lat" : 47.7341451,
                            "lng" : -122.2359033
                        },
                        "southwest" : {
                            "lat" : 47.4955511,
                            "lng" : -122.4359086
                        }
                    },
                    "location" : {
                        "lat" : 47.6062095,
                        "lng" : -122.3320708
                    },
                    "location_type" : "APPROXIMATE",
                    "viewport" : {
                        "northeast" : {
                            "lat" : 47.7341451,
                            "lng" : -122.2359033
                        },
                        "southwest" : {
                            "lat" : 47.4955511,
                            "lng" : -122.4359086
                        }
                    }
                },
                "place_id" : "ChIJVTPokywQkFQRmtVEaUZlJRA",
                "types" : [ "locality", "political" ]
            },
            statusCodes : {
                OK : "OK",                              // indicates that no errors occurred; the address was successfully parsed and at least one geocode was returned.
                ZERO_RESULTS : "ZERO_RESULTS",          // indicates that the geocode was successful but returned no results. This may occur if the geocoder was passed a non-existent address.
                OVER_QUERY_LIMIT : "OVER_QUERY_LIMIT",  // indicates that you are over your quota.
                REQUEST_DENIED : "REQUEST_DENIED",      // indicates that your request was denied.
                INVALID_REQUEST : "INVALID_REQUEST",    // generally indicates that the query (address, components or latlng) is missing.
                UNKNOWN_ERROR : "UNKNOWN_ERROR"         // indicates that the request could not be processed due to a server error. The request may succeed if you try again.
            },
            init : function init(){
                Restangular.setBaseUrl( 'https://maps.googleapis.com/maps/api/geocode/' );
                Restangular.setJsonp( false );
                Restangular.setDefaultRequestParams( 'jsonp', { callback: 'JSON_CALLBACK' } );
                _googleMapService.API = Restangular.one( 'json' );
            },
            normalize : function normalize( locationData ){
                // TODO : other failure cases?
                if( !locationData || !locationData.results || locationData.results.length <= 0 ){
                    return {
                        formatted_address : '',
                        city : '',
                        state : '',
                        lat : 0,
                        lon : 0,
                        status : _googleMapService.statusCodes.UNKNOWN_ERROR
                    };
                }

                return {
                    formatted_address : locationData.results[ 0 ].formatted_address,
                    city : locationData.results[ 0 ].address_components[ 0 ].long_name,
                    state : locationData.results[ 0 ].address_components[ 2 ].short_name,
                    lat : locationData.results[ 0 ].geometry.location.lat,
                    lon : locationData.results[ 0 ].geometry.location.lng,
                    status : locationData.status
                };
            }
        };

        // public service
        var googleMapService = {
            location : null,
            /**
             * @ngdoc method
             * @name spiral9.services.GoogleMapService#getLocation
             * @methodOf spiral9.services.GoogleMapService
             * @description Returns a promise that will resolve to the location for the provided city, state.<br/>
             * @returns {Promise}
             */
            getLocation : function getLocation( city, state ){
                _googleMapService.init();
                var deferred = $q.defer();

                function failed( error ){
                    // TODO : retry logic here
                    deferred.reject( error );
                }

                _googleMapService.API
                    .get( {
                        address : city + ',+' + state,
                        key : _googleMapService.apiKey
                    } )
                    .then(
                        function locationReceived( locationData ) {
                            console.log( CN + ".locationReceived" );

                            googleMapService.location = _googleMapService.normalize( locationData );

                            if( googleMapService.location.status === _googleMapService.statusCodes.OK ){
                                console.log( '\tgoogleMapService.location : ', googleMapService.location );
                                deferred.resolve( googleMapService.location );
                            } else {

                                failed( { msg : 'ERROR : received bad data' } );
                            }
                        },
                        function locationFailed( error ) {
                            failed( error );
                        } );

                return deferred.promise;
            },
            reset : function reset(){
                googleMapService.location = angular.copy( _googleMapService.defaultLocation );
            }
        };

        // init
        googleMapService.reset();
        googleMapService.getLocation( _googleMapService.defaultCityState.city, _googleMapService.defaultCityState.state );

        // export public service
        return googleMapService;
    } );

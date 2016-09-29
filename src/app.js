/*
 * app.js
 *
 * The MIT License (MIT)

 * Copyright (c) 2016 Spiral9 Inc

 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * @ngdoc app
 * @name weatherLens
 * @description This is the root module for the weatherLens application.
 */

angular.module( 'spiral9.app.weatherLens', [
    // built-ins
    'ngTouch',
    'restangular',
    // services
    'spiral9.services.ForecastService',
    'spiral9.services.GoogleMapService',
    'spiral9.services.SignalTowerService',
    // directives
    'spiral9.directives.bgPane',
    'spiral9.directives.titleBar',
    'spiral9.directives.weatherCurrentlyPanel',
    'spiral9.directives.weatherDailyPanel',
    'spiral9.directives.footerBar',
    // filters

    // components
    'templates-components'
] )
    .config( function weatherLensConfig() {
        var CN = "weatherLensConfig";
    } )

    .controller( 'weatherLensController', function weatherLensController( $scope ) /*, ForecastService, GoogleMapService*/ {

    } )

    .run( function(){ } );

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
    'spiral9.services.GoogleMapService'
] )

/**
 * @ngdoc directive
 * @name titleBar
 * @restrict E
 * @element ANY
 * @description Displays a background image at random (1 of scope.imageCount)
 */
    .directive( 'titleBar', function titleBarDirective( GoogleMapService ) {
        var CN = 'titleBarDirective';

        return {
            restrict : 'E',
            replace : true,
            templateUrl : 'titleBar/titleBar.tpl.html',
            scope : {},
            link : function titleBarDirectiveLink( scope, element, attrs ) {
                scope.GoogleMapService = GoogleMapService;

                scope.init = function init(){

                };

                scope.$evalAsync( scope.init );
            }
        };
    } );

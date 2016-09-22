/*
 * footerBar.js
 *
 * The MIT License (MIT)
 *
 */

/**
 * @ngdoc overview
 * @name directives.footerBar
 * @description An empty module description. Please fill in a high level description of this module.
 */
angular.module( 'spiral9.directives.footerBar', [
    'ngTouch',
    'spiral9.filters.makeSafeHTML'
] )

/**
 * @ngdoc directive
 * @name footerBar
 * @restrict E
 * @element ANY
 * @description Displays a background image at random (1 of scope.imageCount)
 */
    .directive( 'footerBar', function footerBarDirective( ) {
        var CN = 'footerBarDirective';

        return {
            restrict : 'E',
            replace : true,
            templateUrl : 'footerBar/footerBar.tpl.html',
            scope : {},
            link : function footerBarDirectiveLink( scope, element, attrs ) {
                scope.init = function init(){

                };

                scope.$evalAsync( scope.init );
            }
        };
    } );

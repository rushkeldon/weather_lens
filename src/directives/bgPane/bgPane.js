/*
 * bgPane.js
 *
 * The MIT License (MIT)
 *
 */

/**
 * @ngdoc overview
 * @name directives.bgPane
 * @description An empty module description. Please fill in a high level description of this module.
 */
angular.module( 'spiral9.directives.bgPane', [
    'ngTouch',
    'spiral9.filters.makeSafeHTML'
] )

/**
 * @ngdoc directive
 * @name bgPane
 * @restrict E
 * @element ANY
 * @description Displays a background image at random (1 of scope.imageCount)
 */
    .directive( 'bgPane', function bgPaneDirective() {
        var CN = 'bgPaneDirective';
        var imageCount = 4;

        return {
            restrict : 'E',
            replace : true,
            templateUrl : 'bgPane/bgPane.tpl.html',
            scope : {},
            link : function bgPaneDirectiveLink( scope, element, attrs ) {
                scope.init = function init(){
                    var bgImgURL = '../img/bg-00' + Math.floor( Math.random() * imageCount ) + '.jpg';
                    element.css( {
                        'background-image': 'url(' + bgImgURL +')'
                    } );
                };

                scope.$evalAsync( scope.init );
            }
        };
    } );

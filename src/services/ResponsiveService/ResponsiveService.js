angular.module( 'spiral9.services.ResponsiveService', [
    'spiral9.services.SignalTowerService'
] )

    .service( 'ResponsiveService', function ResponsiveService( $rootScope, $window, SignalTowerService ) {
        var CN = "ResponsiveService";
        var TAGS = {
            small : 'small',
            medium : 'medium',
            large : 'large'
        };

        function BreakPoint( tagName, minWidth, maxWidth ) {
            return {
                tag : tagName,
                min : minWidth,
                max : maxWidth
            };
        }

        var defaults = {
            aspectRatio : "16:9",
            breakPoints : {
                small : new BreakPoint( TAGS.small, 0, 767 ),
                medium : new BreakPoint( TAGS.medium, 768, 1099 ),
                large : new BreakPoint( TAGS.large, 1100, Infinity )
            }
        };

        function noop() {}

        var _responsiveService = {
            isTouchDevice : null,
            width : 0,
            height : 0,
            tag : '',
            breakPoints : angular.copy( defaults.breakPoints ),
            resize : {
                id : 0,
                ms : 25
            },
            windowResized : function windowResized( isInit ) {
                var broadcastMethod = noop;
                if( isInit || _responsiveService.width !== $window.innerWidth || _responsiveService.height !== $window.innerHeight ) {
                    _responsiveService.width = $window.innerWidth;
                    _responsiveService.height = $window.innerHeight;
                    var freshTag = responsiveService.tag();
                    if( freshTag !== _responsiveService.tag ) {
                        _responsiveService.tag = freshTag;
                        broadcastMethod = function dispatchSignal() {
                            // console.log( CN + ".signalBreakPointChanged" );
                            // console.log( "\t_responsiveService.tag :", _responsiveService.tag );
                            SignalTowerService.dispatchSignal( 'signalBreakPointChanged', _responsiveService.tag );
                        };
                    }
                    $rootScope.$evalAsync( broadcastMethod );
                }
                SignalTowerService.dispatchSignal( 'signalWindowResized' );
            },
            init : function init() {
                angular.element( $window ).on( 'resize', function windowStartedResizing( e ) {
                    clearTimeout( _responsiveService.resize.id );
                    _responsiveService.resize.id = setTimeout( _responsiveService.windowResized, _responsiveService.resize.ms );
                } );

                angular.element( $window ).on( 'orientationchange', function windowOrientationChanged( e ) {
                    _responsiveService.windowResized();
                } );

                /* // QUESTION : are the 'resize' and 'orientationchange' events enough for all environments, or do we need a timer?
                 _responsiveService.resize.id = setInterval( _responsiveService.windowResized, _responsiveService.resize.ms );
                 */
                if( _responsiveService.width === 0 ) {
                    _responsiveService.windowResized( true );
                }
            }
        };

        var responsiveService = {
            TAGS : TAGS,
            isTouchDevice : function isTouchDevice() {
                if( _responsiveService.isTouchDevice === null ){
                    _responsiveService.isTouchDevice = 'ontouchstart' in $window.document.documentElement;
                }
                return _responsiveService.isTouchDevice;
            },
            tag : function tag() {
                var sizeTag;
                var bp = _responsiveService.breakPoints;
                var w = _responsiveService.width;
                switch( true ) {
                    case (w >= bp.small.min && w <= bp.small.max):
                        sizeTag = bp.small.tag;
                        break;
                    case (w >= bp.medium.min && w <= bp.medium.max):
                        sizeTag = bp.medium.tag;
                        break;
                    case (w >= bp.large.min && w <= bp.large.max):
                        sizeTag = bp.large.tag;
                        break;
                    default:
                        sizeTag = bp.large.tag;
                }
                return sizeTag;
            },
            width : function width() {
                return _responsiveService.width;
            },
            height : function height() {
                return _responsiveService.height;
            },
            breakPoints : function breakPoints() {
                return _responsiveService.breakPoints;
            },
            convertWidthToPercent : function convertWidthToPercent( desktopWidth, desktopContainerWidth ) {
                var width = "100%";
                if( desktopWidth && desktopContainerWidth ) {
                    width = ((desktopWidth / desktopContainerWidth) * 100) + "%";
                }
                return width;
            },
            convertPaddingToPercents : function convertPaddingToPercents( pixelPadding, desktopContainerWidth, aspectRatio ) {
                aspectRatio = aspectRatio ? aspectRatio : defaults.aspectRatio;
                var aspectRatioArray = aspectRatio.split( ":" );
                if( aspectRatioArray.length !== 2 ) {
                    aspectRatioArray = [ "16", "9" ];
                }
                // convert the aspect ratio into a factor
                aspectRatio = parseInt( aspectRatioArray[ 1 ], 10 ) / parseInt( aspectRatioArray[ 0 ], 10 );
                var zeroPixels = "0px";
                var padding = zeroPixels;
                if( pixelPadding ) {
                    var i, p;
                    var paddingArray = pixelPadding.split( " " );
                    // normalize the padding into four distinct values
                    switch( paddingArray.length ) {
                        case 1:
                            paddingArray[ 1 ] = paddingArray[ 0 ];
                            paddingArray[ 2 ] = paddingArray[ 0 ];
                            paddingArray[ 3 ] = paddingArray[ 0 ];
                            break;
                        case 2:
                            var paddingVertical = paddingArray[ 0 ];
                            var paddingHorizontal = paddingArray[ 1 ];
                            paddingArray[ 0 ] = paddingVertical;
                            paddingArray[ 1 ] = paddingHorizontal;
                            paddingArray[ 2 ] = paddingVertical;
                            paddingArray[ 3 ] = paddingHorizontal;
                            break;
                        case 3:
                            paddingArray[ 3 ] = paddingArray[ 1 ];
                            break;
                        case 4:
                            // noop
                            break;
                        default:
                            console.error( CN + " received an invalid pixelPadding : " + pixelPadding );
                            return padding;
                    }

                    for( i = 0; i < 4; i++ ) {
                        if( paddingArray[ i ].indexOf( 'px' ) !== -1 ) {
                            p = parseInt( paddingArray[ i ], 10 );
                            if( p === undefined || p === 0 ) {
                                p = zeroPixels;
                            }
                            if( p !== zeroPixels ) {
                                // vertical
                                if( i % 2 === 0 ) {
                                    /* 16x9 ratio 9/16 = 0.5625 = 56.25% */
                                    p *= aspectRatio;
                                }
                                p = ((p / desktopContainerWidth) * 100) + "%";
                            }
                            paddingArray[ i ] = p;
                        }
                    }

                    padding = paddingArray.join( " " );
                }
                return padding;
            },
            normalizeURLs : function normalizeURLs( rawURLs ) {
                var URLs = null;
                if( rawURLs && rawURLs.large ) {
                    URLs = {
                        large : rawURLs.large
                    };
                    URLs.medium = rawURLs.medium ? rawURLs.medium : URLs.large;
                    URLs.small = rawURLs.small ? rawURLs.small : URLs.medium;

                } else {
                    console.error( CN + ".normalizeURLs - missing the *required* 'large' URL." );
                }
                return URLs;
            }
        };

        _responsiveService.init();

        SignalTowerService.createSignal( 'signalWindowResized' );
        SignalTowerService.createSignal( 'signalBreakPointChanged' );

        return responsiveService;
    } );

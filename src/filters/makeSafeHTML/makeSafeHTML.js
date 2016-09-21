angular.module( 'spiral9.filters.makeSafeHTML', [] )
    .filter( 'makeSafeHTML', function makeSafeHTML( $sce ) {
        return $sce.trustAsHtml;
    } );
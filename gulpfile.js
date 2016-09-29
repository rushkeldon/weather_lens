var gulp = require( 'gulp' ),
    browserify = require( 'browserify' ),
    buffer = require( 'vinyl-buffer' ),
    concat = require( 'gulp-concat' ),
    copy = require( 'gulp-copy' ),
    del = require( 'del' ),
    flatten = require( 'gulp-flatten' ),
    globby = require( 'globby' ),
    gutil = require( 'gulp-util' ),
    html2js = require( 'gulp-html2js' ),
    jshint = require( 'gulp-jshint' ),
    karma = require( 'gulp-karma' ),
    less = require( 'gulp-less' ),
    newer = require('gulp-newer'),
    ngAnnotate = require( 'browserify-ngannotate' ),
    rename = require( 'gulp-rename' ),
    source = require( 'vinyl-source-stream' ),
    sourcemaps = require( 'gulp-sourcemaps' ),
    through2 = require( 'through2' ),
    uglify = require( 'gulp-uglify' ),
    webserver = require( 'gulp-webserver' );

var paths = {
    build : 'build',
    lessMain : './src/less/main.less',
    buildCSS : './build/css'
};

var fileNames = {
    cssFile : 'weatherlens.css'
};

var filePatterns = {
    jsProd : [ 'src/**/*.js', '!src/**/*.spec.js' ],
    directiveTemplates : 'src/directives/**/*.tpl.html',
    lessForDirectives : 'src/directives/**/*.less',
    /* the file arrays below are here in case there are files not via CDN, but local */
    fontFiles : [],
    vendorCSSfiles : [],
    vendorJSfiles : []
};

// deletes the build directory
gulp.task( 'clean', function deleteBuildDir() {
    del( [ paths.build + '/**/*' ] );
} );

// compiles less and creates inline css source map
// requires the less-plugin-glob to allow glob imports in LESS files
gulp.task( 'compileLESS', [], function compileLESS() {
    var stream = gulp.src( paths.lessMain )
        .pipe( sourcemaps.init() )
        .pipe( less( { plugins : [ require( 'less-plugin-glob' ) ] } ) );

    stream.on( 'error', function lessCompileFailed( error ) {
        gutil.log( error );
    } );

    stream.pipe( rename( fileNames.cssFile ) )
        .pipe( sourcemaps.write() )
        .pipe( gulp.dest( paths.buildCSS ) );
    return stream;
} );

// compiles HTML templates and adds them to angular template cache
gulp.task( 'compileHTMLtemplates', [], function compileHTMLtemplates() {
    return gulp.src( filePatterns.directiveTemplates, { base : '.' } )
        .pipe( html2js( {
            outputModuleName : 'templates-components',
            base : 'src/directives'
        } ) )
        .pipe( concat( 'templates-components.js' ) )
        .pipe( uglify() )
        .pipe( gulp.dest( './build/js' ) );
} );

// runs jshint - fails on any error
gulp.task( 'jsHint', [], function jsHint() {
    gulp.src( filePatterns.jsProd )
        .pipe( jshint() )
        .pipe( jshint.reporter( 'jshint-smart' ) )
        .pipe( jshint.reporter( 'fail' ) );
} );

// compiles JS
gulp.task( 'compileJS', [], function compileJS() {
    // gulp expects tasks to return a stream, so we create one here.
    var bundledStream = through2();

    bundledStream
        .pipe( source( 'weatherlens.js' ) )
        .pipe( buffer() )
        .pipe( sourcemaps.init( { loadMaps : true } ) )
        .pipe( uglify() )
        .on( 'error', gutil.log )
        .pipe( sourcemaps.write( './' ) )
        .pipe( gulp.dest( './build/js/' ) );

    // globby replaces the normal gulp.src as browserify creates it's own readable stream
    globby( [ 'src/**/*.js', '!src/**/*.spec.js' ] )
        .then(
        function processFiles( entries ) {
            var b = browserify( {
                entries : entries,
                debug : true,
                transform : [ ngAnnotate ]
            } );

            // pipe the Browserify stream into the stream we created earlier - this starts our gulp pipeline.
            b.bundle().pipe( bundledStream );
        } )
        .catch( function( err ) {
            bundledStream.emit( 'error', err );
        } );

    return bundledStream;
} );

// copy images ( if newer )
gulp.task( 'copyImages', [], function copyImages() {
    var imgSrc = 'img/**/*';
    var imgDest = './build';
    return gulp.src( imgSrc, { 'base' : '.' } )
        .pipe( newer( imgDest ) )
        .pipe( gulp.dest( './build' ) );
} );

// copy vendor css files
gulp.task( 'copyVendorCSS', [], function copyVendorCSS() {
    return gulp.src( filePatterns.vendorCSSfiles, { "base" : "." } )
        .pipe( flatten() )
        .pipe( gulp.dest( './build/css' ) );
} );

// copy vendor js files to build directory (if any)
gulp.task( 'copyVendorJS', [], function copyVendorJS() {
    return gulp.src( filePatterns.vendorJSfiles, { "base" : "." } )
        .pipe( flatten() )
        .pipe( gulp.dest( './build/js' ) );
} );

// copy fonts
gulp.task( 'copyFonts', [], function copyFonts() {
    return gulp.src( filePatterns.fontFiles, { "base" : "." } )
        .pipe( flatten() )
        .pipe( gulp.dest( './build/fonts' ) );
} );

// copy main files
gulp.task( 'copyMainFiles', [], function copyMainFiles() {
    return gulp.src( [ 'src/index.html' ] )
        .pipe( gulp.dest( './build' ) );
} );

// full build
gulp.task( 'default', [
    'compileLESS',
    'jsHint',
    'compileHTMLtemplates',
    'compileJS',
    'copyImages',
    'copyVendorJS',
    'copyFonts',
    'copyVendorCSS',
    'copyMainFiles'
], function buildWeatherlens() {

} );

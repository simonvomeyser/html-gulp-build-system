//Add the CSS part of your Libs
var csslibs = [
  './node_modules/bootstrap/dist/css/bootstrap.min.css'
]

//Add the JS part of your libs
var jslibs = [
  './node_modules/jquery/dist/jquery.min.js', 
  './node_modules/bootstrap/dist/js/bootstrap.min.js', 
]

// Dependencys
var gulp = require('gulp');
var stylus = require('gulp-stylus');
var pug = require('gulp-pug');

var autoprefixer = require('gulp-autoprefixer');

var util = require('gulp-util');
var notify = require('gulp-notify');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var uglifycss = require('gulp-uglifycss');
var imagemin = require('gulp-imagemin');
var uncss = require('gulp-uncss');

var browserSync = require('browser-sync');
var reload = browserSync.reload;
var historyApiFallback = require('connect-history-api-fallback');


// Modes
var in_production_mode = !!util.env.production

/**
 * Compiles stylus and creates libs
 */
gulp.task('styles',function() {

  // @todo move over fonts

  // Compiles CSS
  gulp.src(['./stylus/app.styl'])
    .pipe(sourcemaps.init())
    .pipe(stylus({
      'include css': true,
      'compress': in_production_mode
    }))
    .on('error', function(err) {
        notify().write(err);
        this.emit('end');
    })
    //Only remove unused css in production
    .pipe(in_production_mode ? uncss({
        html: ['dist/**/*.html']
    }) : util.noop())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css'))
      
    //create libs.css
    gulp.src(csslibs)
    .pipe(sourcemaps.init())
    .pipe(concat('libs.css'))
    //Uglify in production
    .pipe(in_production_mode ? uglifycss() : util.noop())
    .pipe(uncss({
        html: ['dist/**/*.html']
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css'))
    .pipe(reload({stream:true}));

});

gulp.task('scripts', function() {
  jslibs.push('./js/app.js')
  return gulp.src(jslibs)
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    //Uglify in production
    .pipe(in_production_mode ? uglify() : util.noop())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/js/'))
    .pipe(reload({stream:true}));
});

gulp.task('html', function () {
  gulp.src(['./html/**.*'])
    .pipe(pug({
        pretty: !in_production_mode
        }))
    .on('error', notify.onError(function (error) {
      return error;
    }))
    .pipe(gulp.dest('./dist/'))
    .pipe(reload({stream:true}));
})

/*
  Browser Sync
*/
gulp.task('browser-sync', function() {
    browserSync({
        // we need to disable clicks and forms for when we test multiple rooms
        server : {
          baseDir: './dist/'
        },
        ghostMode: false
    });
});

/**
 * Minify and move over images in img/ folder
 */
gulp.task('images', function() {
    gulp.src('./img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/img'));
});

gulp.task('default', ['styles', 'html', 'scripts', 'images', 'browser-sync'], function() {
  gulp.watch('stylus/**/*', ['styles']);
  gulp.watch('html/**/*', ['html']);
  gulp.watch('js/**/*', ['scripts']);
  gulp.watch('img/**/*', ['images']);
});



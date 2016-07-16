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
  gulp.src(['./css/app.styl'])
    .pipe(sourcemaps.init())
    .pipe(stylus({
      'include css': true,
      'compress': in_production_mode
    }))
    .on('error', function(err) {
        notify().write(err);
        this.emit('end');
    })
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css'))
      
    //create libs.css
    gulp.src([
      //Add your libs here
      './node_modules/bootstrap/dist/css/bootstrap.min.css'
    ])
    .pipe(sourcemaps.init())
    .pipe(concat('libs.css'))
    //Uglify in production
    .pipe(in_production_mode ? uglifycss() : util.noop())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css'))
    .pipe(reload({stream:true}));

});

gulp.task('scripts', function() {
  return gulp.src([
    //Add your libs here
    './node_modules/jquery/dist/jquery.min.js', 
    './node_modules/bootstrap/dist/js/bootstrap.min.js', 
    //Custom Js
    './js/app.js', 
  ])
    .pipe(concat('app.js'))
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


gulp.task('test', function() {
  console.log (util.env.production); //Debug
});
// run 'scripts' task first, then watch for future changes
gulp.task('default', ['styles', 'html', 'scripts', 'browser-sync'], function() {
  gulp.watch('css/**/*', ['styles']); // gulp watch for stylus changes
  gulp.watch('html/**/*', ['html']);
  gulp.watch('js/**/*', ['scripts']);
 // gulp watch for html changes
});



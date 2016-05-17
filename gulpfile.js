var gulp = require('gulp');
var stylus = require('gulp-stylus');
var pug = require('gulp-pug');

var autoprefixer = require('gulp-autoprefixer');

var notify = require('gulp-notify');

var browserSync = require('browser-sync');
var reload = browserSync.reload;
var historyApiFallback = require('connect-history-api-fallback')

/*
  Styles Task
*/

gulp.task('styles',function() {

  // move over fonts
  // gulp.src('css/fonts/**.*')
  //   .pipe(gulp.dest('dist/css/fonts'))

  // Compiles CSS
  gulp.src(['./css/style.styl'])
    .pipe(stylus())
    .on('error', function(err) {
        notify().write(err);
        this.emit('end');
    })
    .pipe(autoprefixer())
    .pipe(gulp.dest('./dist/css'))
    .pipe(reload({stream:true}));
    
    // .pipe(autoprefixer())
    // .pipe(reload({stream:true}))
});

gulp.task('html', function () {
  gulp.src(['./html/**.*'])
    .pipe(pug({
          pretty: true
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


// run 'scripts' task first, then watch for future changes
gulp.task('default', ['styles', 'html', 'browser-sync'], function() {
  gulp.watch('css/**/*', ['styles']); // gulp watch for stylus changes
  gulp.watch('html/**/*', ['html']);
 // gulp watch for html changes
});

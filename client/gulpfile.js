var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('default', ['less', 'js', 'html'], function (){
  $.refresh.listen();
  gulp.watch(['less/**/*.less'], ['less']);
  gulp.watch(['js/**/*.js'], ['js']);
  gulp.watch(['templates/**/*.html'], ['html']);
});

gulp.task('less', () => {
  gulp.src('less/**/[^_]*.less')
    .pipe($.less())
    .pipe(gulp.dest(__dirname+'/bin/css'))
    .pipe($.refresh())
  ;
});

gulp.task('js', () => {
  gulp.src('js/**/*.js')
    .pipe($.babel({
      presets: ['es2015'],
      plugins: ['angularjs-annotate']
    }))
    .pipe($.concat('bundle.min.js'))
    .pipe(gulp.dest(__dirname+'/bin/js'))
    .pipe($.refresh())
  ;
});

gulp.task('html', () => {
  gulp.src('templates/**/*.html')
    .pipe($.refresh())
  ;
});

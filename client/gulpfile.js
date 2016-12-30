var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('default', function (){
  $.refresh.listen();
  gulp.watch(['css/**/*.css'], ['css']);
  gulp.watch(['js/**/*.js'], ['js']);
  gulp.watch(['**/*.html'], ['html']);
});

gulp.task('css', () => {
  gulp.src('css/**/*.css')
    .pipe($.refresh())
  ;
});

gulp.task('js', () => {
  gulp.src('js/**/*.js')
    .pipe($.refresh())
  ;
});

gulp.task('html', () => {
  gulp.src('**/*.html')
    .pipe($.refresh())
  ;
});

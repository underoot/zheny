var
  $    = require('gulp-load-plugins')(),
  gulp = require('gulp');


gulp.task('styles', function() {
  gulp.src('app/css/**/*.css')
    .pipe($.minifyCss())
    .pipe($.autoprefixer())
    .pipe(gulp.dest('dist/css'));

});

gulp.task('pages', function() {
  gulp.src('app/**/*.html')
    .pipe($.useref())
    .pipe($.minifyHtml())
    .pipe(gulp.dest('dist'));

});

gulp.task('images', function() {
  gulp.src('app/img/*.*')
    .pipe(gulp.dest('dist/img'));

});

gulp.task('server', function() {

  return gulp.src('app')
    .pipe($.webserver({
      livereload: true,
    }))

});

gulp.task('build', ['styles', 'pages', 'images']);

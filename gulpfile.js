var
  $    = require('gulp-load-plugins')(),
  gulp = require('gulp');


gulp.task('clean', function() {
  return gulp.src('dist/**/*', { read: false })
    .pipe($.rimraf({ force: true }));

});

gulp.task('styles', function() {
  return gulp.src('app/zheny/css/**/*.css')
    .pipe($.minifyCss())
    .pipe($.autoprefixer())
    .pipe(gulp.dest('dist/css'));

});

gulp.task('pages', function() {
  return gulp.src('app/**/*.html')
    .pipe($.useref())
    .pipe($.minifyHtml())
    .pipe(gulp.dest('dist'));

});

gulp.task('images', function() {
  return gulp.src('app/zheny/img/**/*')
    .pipe($.imagemin({ optimizationLevel: 1 }))
    .pipe(gulp.dest('dist/img'));

});

gulp.task('server', function() {

  return gulp.src('app')
    .pipe($.webserver({
      livereload: true,
    }))

});

gulp.task('build', ['styles', 'pages', 'images'], function() {
  return gulp.src('dist/**/*')
    .pipe($.size({
      title: 'build',
      showFiles: true
    }))
});

gulp.task('default', ['clean'], function() {
  return gulp.start('build');
});

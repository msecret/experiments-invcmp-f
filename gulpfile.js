'use strict';
var path = require('path');

var gulp = require('gulp');
var refresh = require('gulp-livereload');
var livereload = require('tiny-lr');
var server = livereload();
var less = require('gulp-less');

gulp.task('livereload-server', function () {
  server.listen(35729, function (err) {
    if (err) { return console.log(err); }
  });
});

gulp.task('css', function () {
  gulp.src('app/**/*.css').pipe(refresh(server));
});

gulp.task('less', function () {
  gulp.src('./app/css/src/**/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./app/css/compiled'));
});

gulp.task('js', function () {
  gulp.src('app/**/*.js').pipe(refresh(server));
});

gulp.task('default', function () {
  gulp.run('livereload-server');

  gulp.watch('app/css/src/**/*.less', function (event) {
    gulp.run('css');
    gulp.run('less');
  });

  gulp.watch('app/**/*.js', function (event) {
    gulp.run('js');
  });
});

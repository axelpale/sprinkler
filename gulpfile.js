var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var mocha = require('gulp-mocha');

var DEST = './';

gulp.task('default', function () {
  return gulp.src('src/sprinkler.js')
    .pipe(gulp.dest(DEST))
    .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(rename({ extname: '.min.js' }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(DEST));
});

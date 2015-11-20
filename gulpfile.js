var gulp = require('gulp'),
  sass = require('gulp-sass'),
  concat = require('gulp-concat'),
  htmlMinify = require('gulp-minify-html'),
  cssMinify = require('gulp-minify-css'),
  jsMinify = require('gulp-minify'),
  mocha = require('gulp-mocha'),
  del = require('del');

gulp.task('default', ['htmlProcess', 'scssProcess', 'jsProcess', 'watch']);

// HTML Minify to ./build/
gulp.task('htmlProcess', function() {
  return gulp.src('./src/**/*.html')
    .pipe(htmlMinify().on('error', console.log))
    .pipe(gulp.dest('./build/'));
});

// SCSS Transpile to ./src/css
gulp.task('scssProcess', function() {
  return gulp.src('./src/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./src/css/'));
});

// CSS concat & minify to ./build/style
gulp.task('cssProcess', function() {
  return gulp.src('./src/css/**/*.css')
    .pipe(concat('app.css').on('error', console.log))
    .pipe(cssMinify().on('error', console.log))
    .pipe(gulp.dest('./build/style/'));
});

// Run Tests in ./test/test.js
gulp.task('jsTest', function() {
  return gulp.src('./test/test.js', { read: false })
    .pipe(mocha().on('error', console.log));
});

// Javascript concat & minify to ./src/script
gulp.task('jsProcess', function() {
  return gulp.src('./src/script/**/*.js')
    .pipe(concat('app.js').on('error', console.log))
    .pipe(jsMinify().on('error', console.log))
    .pipe(gulp.dest('./build/script'));
});
gulp.task('jsClean', function() {
  del(['./build/script/app.js']);
});


// Watchem
gulp.task('watch', function() {
  gulp.watch('./src/**/*.html', ['htmlProcess']);
  gulp.watch('./src/scss/**/*.scss', ['scssProcess']);
  gulp.watch('./src/css/**/*.css', ['cssProcess']);
  gulp.watch('./test/**/*.js', ['jsTest']);
  gulp.watch('./src/script/**/*.js', ['jsTest', 'jsProcess']);
  gulp.watch('./build/script/app-min.js', ['jsClean']);
});

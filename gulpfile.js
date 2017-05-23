'use strict';
var gulp = require('gulp');
var browserSync = require('browser-sync');


var clean = require('gulp-clean');//清除文件
var babelify = require('babelify');
var browserify = require('browserify');
var vinylSource = require('vinyl-source-stream');


var eslint = require('gulp-eslint');

gulp.task("copyIndex", function () {
  gulp.src("src/index.html")
    .pipe(gulp.dest("./dist"))
    .pipe(browserSync.reload({ stream: true }));
  console.log("reload success ...")
});

gulp.task('browserSync', function () {
  browserSync({
    server: {
      baseDir: './dist'
    },
    port: "3008"
  });
});

gulp.task("watchFiles", function () {
  gulp.watch('src/index.html', ['copyIndex']);
  gulp.watch('src/**/*.js', ['babelIt', 'copyIndex']);
});


// es6 => es5
gulp.task("babelIt", function () {
  browserify({
    entries: 'src/index.js',
    debug: true
  })
    .transform(babelify, {
      presets: ["es2015"]
    })
    .bundle()
    .pipe(vinylSource('index.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('eslint', function () {
  return gulp.src(['./src/**/*.js'])
    .pipe(eslint({
      "rules": {
        "camelcase": [2, { "properties": "always" }],
        "comma-dangle": [2, "never"],
        "semi": [2, "always"],
        "quotes": [2, "single"],
        "strict": [2, "global"]
      },
      "parser": "babel-eslint"
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});


//处理src 目录下的所有scss

gulp.task("clean", function () {
  gulp.src("./dist/", { read: false })
    .pipe(clean());
});

gulp.task("default", ["copyIndex", "babelIt", "browserSync", "watchFiles"]);

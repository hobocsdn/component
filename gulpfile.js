'use strict';
var gulp = require('gulp');
var browserSync = require('browser-sync');


var clean = require('gulp-clean'); //清除文件
var babelify = require('babelify');
var browserify = require('browserify');
var vinylSource = require('vinyl-source-stream');
var options = process.argv.slice(2);
var isProduct = options[1] === "product" ? true : false;
var eslint = require('gulp-eslint');
var jade = require("gulp-jade");
var gulpLoadPlugins = require('gulp-load-plugins'),
    $ = gulpLoadPlugins();


gulp.task("copyIndex", function() {
    gulp.src("src/index.html")
        .pipe(gulp.dest("./dist"))
        .pipe(browserSync.reload({ stream: true }));
    console.log("reload success ...")
});

console.log("isProduct--", isProduct);
gulp.task('browserSync', function() {
    browserSync({
        server: {
            //src只在支持ES6 module使用Chrome Canary 或Safari上 直接调试 无需打包
            baseDir: isProduct ? './dist' : './src'
        },
        port: "3008"
    });
});

gulp.task("watchFiles", function() {
    gulp.watch('src/index.html', ['copyIndex']);
    gulp.watch('src/**/*.js', ['babelIt', 'copyIndex']);
    gulp.watch('./src/**/*.pug', ['pug']);
});


// es6 => es5
gulp.task("babelIt", function() {
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

gulp.task('eslint', function() {
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



gulp.task("clean", function() {
    gulp.src("./dist/", { read: false })
        .pipe(clean());
});

gulp.task('jade', function() {
    return gulp.src(['./app/**/*.jade'])
        .pipe($.jade({ pretty: true }))
        .on('error', errorHandler('jade'))
        .pipe(gulp.dest(dest));
});

gulp.task('sass', function() {
    return gulp.src(['./app/**/*.sass'])
        .pipe($.sass())
        .on('error', errorHandler('sass'))
        .pipe(gulp.dest(dest));
});

var productTask = ["copyIndex", "babelIt", "browserSync", "watchFiles"];
var devTask = ["browserSync", "watchFiles"];
gulp.task("default", isProduct ? productTask : devTask);

gulp.task('pug', function() {
    gulp.src('./src/*.pug')
        .pipe($.pug({
            pretty: true
        }))
        .pipe(gulp.dest('./src/'));
});
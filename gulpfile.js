'use strict';

var gulp = require('gulp');
// 管理gulp所有插件
var $ = require('gulp-load-plugins')();

var browserSync = require("browser-sync").create(); //热键--实现自动刷新功能

var isProduct = false;
var buildTask = isProduct ? ['build'] : []
/* gulp 任务
 - sass 编译
 - es6 编译打包
 - 启动热刷新服务
 - 监听文件变化
 - 清除文件
*/

// -----启动服务
gulp.task('serve', buildTask, function() {
    browserSync.init({
        server:{
            baseDir: ["./dist"]
        },
        proxy:"http://localhost:3008/"
    });
    gulp.watch("scss/**/*.scss", ['sass']);
    gulp.watch("dist/*.*").on("change", browserSync.reload);
});


gulp.task('build',function() {

});

gulp.task('watch', function() {

});


gulp.task('clean',function(){
  return gulp.src(['dist/**/*.*'], {read: false})
      .pipe($.clean());
});

gulp.task('sass', function() {
    return gulp.src("src/**/*.scss")
        .pipe($.sass())
        .pipe(gulp.dest("dist/css"))
        .pipe(reload({stream: true}));
});

gulp.task('es6', function() {
  return gulp.src('src/index.js')
    .pipe($.plumber())
    .pipe($.babel())
    .pipe(gulp.dest('dist/'));
});

// gulp.task('default', ['clean'],function(){
//   gulp.start('serve');
// });

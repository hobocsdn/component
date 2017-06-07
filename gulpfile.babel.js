import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';

import clean from 'gulp-clean'; //清除文件
import babelify from 'babelify';
import browserify from 'browserify';
import vinylSource from 'vinyl-source-stream';
import eslint from 'gulp-eslint';

const options = process.argv.slice(2);
const isProduct = options[1] === "product" ? true : false;
const $ = gulpLoadPlugins();
const reload = browserSync.reload;

const extras = { //项目资源文件输入输出
    'in': [
        'assets/*.*',
        '!assets/*.html'
    ],
    'out': 'dist'
};

//语法检查
const lint = {
    'in': ['src/**/*.js', "!src/**/vue.js"]
};
gulp.task('eslint', () => {
    console.log('eslint');
    return gulp.src(lint.in)
        .pipe($.eslint({
            "env": {
                "es6": true,
                "browser": true
            },
            "extends": "eslint:recommended",
            "rules": {
                "camelcase": 1,
                "comma-dangle": 2,
                "quotes": 0,
            },
            "parser": "babel-eslint"
        }))
        .pipe($.eslint.format())
        .pipe($.eslint.failAfterError());
});

gulp.task("copyIndex", () => {
    gulp.src("src/index.html")
        .pipe(gulp.dest("./dist"))
        .pipe(reload({ stream: true }));
    console.log("page reload success ...")
});

console.log("isProduct--", isProduct);
gulp.task('browserSync', () => {
    browserSync({
        server: {
            //src只在支持ES6 module使用Chrome Canary 或Safari上 直接调试 无需打包
            baseDir: isProduct ? './dist' : './src'
        },
        port: "3008"
    });
});

gulp.task("watchFiles", () => {
    gulp.watch('src/index.html', ['copyIndex']); //SPA
    gulp.watch('src/**/*.js', ['scripts']);
    gulp.watch('./src/**/*.pug', ['pug']); //模板文件
    gulp.watch(styles.in, ['styles']);
});

const scripts = {
    "in": "src/**/*.js",
    "out": "dist/js"
}

// es6 => es5
gulp.task("scripts", ["eslint"], () => {
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



gulp.task("clean", () => {
    gulp.src("./dist/", { read: false })
        .pipe(clean());
});

gulp.task('pug', () => {
    gulp.src('./src/*.pug')
        .pipe($.pug({
            pretty: true
        }))
        .pipe(gulp.dest('./src/'));
});

const styles = {
    'in': 'src/sass/index.scss',
    'tmp': 'src/css'
};

gulp.task('styles', () => {
    console.log("reload styles");
    return gulp.src(styles.in)
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.sass.sync({
            outputStyle: 'expanded',
            precision: 10,
            includePaths: ['.']
        }).on('error', $.sass.logError))
        // .pipe($.autoprefixer({ browsers: ['> 1%', 'last 2 versions', 'Firefox ESR'] }))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(styles.tmp))
        .pipe(reload({ stream: true }));
});

var productTask = ["copyIndex", "styles", "scripts", "browserSync", "watchFiles"];
var devTask = ["browserSync", "styles", "watchFiles"];
gulp.task("default", isProduct ? productTask : devTask);
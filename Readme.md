### 项目初始化

- git init
- npm init

```
npm install jade jade-loader -D
npm install sass sass-loader node-sass -D
npm install webpack

npm install style-loader -D
npm install css-loader -D



npm install gulp - D
npm install gulp-load-plugins gulp-plumber gulp-babel -D
npm install gulp-uglify gulp-sass gulp-sourcemaps gulp-eslint -D
```

- npm run build # 创建一个服务器的同时，监听目录下 的.css/.html/.js的文件变化情况
- npm run start # webpack监听变化，重新打包 同时使用 browser-sync 监听 reload



### ES6 开发环境脚手架搭建
开发组合：es6 + scss + jade + webpack + gulp
         javascript + css + html + webpack + node

1. gulp使用ES6语法
- 升级gulp版本 `gulp -v` ==> version>3.9
- 安装babel-core 和 babel-preset-es2015 转换ES6代码 `npm install babel-core babel-preset-es2015 --save-dev`
- 创建.babelrc 文件来使用es2015 preset

```
{
  "presets": ["es2015"]
}
```

- 修改gulp.js 名字为 gulpfile.babel.js `mv gulpfile.js gulpfile.babel.js`
- 在gulpfile.babel.js 使用ES6语法
- 控制台 运行 gulp  `task`


2. 编译ES6=>ES5  + 打包
browserify+babelify+vinylSource
```


```

3. 语法检查 ESLint
4. 模板jade(更名为pug`哈巴狗`):采用pug方式替代html

```
npm  install gulp-pug --save-dev #模板文件
```

5. 编译sass:使用scss替代css
6. 不同时使用：资源打包:webpack

### 目录文件说明
gulpfile 入口:
  任务:preview => build => show
               => wacth => build => reload

src 生产目录
dist 发布目录(压缩合并)

语法配置
.babelrc


### 运行项目
**生产环境运行**
- 执行命令:gulp --env product
- 程序运行环境:ES6编译成ES5

**开发测试环境**
- 执行命令:gulp
- 程序运行环境:在支持ES6 module语法的浏览器环境中运行(如chrome cannary 60 或Safari)




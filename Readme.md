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
```

- npm run build # 创建一个服务器的同时，监听目录下 的.css/.html/.js的文件变化情况
- npm run start # webpack监听变化，重新打包 同时使用 browser-sync 监听 reload



### ES6 开发环境脚手架搭建
开发组合：es6 + scss + jade + webpack + gulp
         javascript + css + html + webpack + node
1. 编译ES6=>ES5  
```
npm  install babel-core -D  #后台编译babel工具
npm install babel-preset-es2015 -D  #babel对ES2015的预设
npm install babel-loader -D #babel加载器
```

2. 语法检查 ESLint
3. 模板jade(更名为pug`哈巴狗`):采用pug方式替代html
```
npm  install gulp-pug --save-dev #模板文件
```
4. 编译sass:使用scss替代css
5. 不同时使用：资源打包:webpack

### 目录文件说明
gulpfile 入口:
  任务:preview => build => show
               => wacth => build => reload

src 生产目录
dist 发布目录(压缩合并)

语法配置
.jshintrc
.babelrc


### 运行项目
**生产环境运行**
- 执行命令:gulp --env product
- 程序运行环境:ES6编译成ES5

**开发测试环境**
- 执行命令:gulp
- 程序运行环境:在支持ES6 module语法的浏览器环境中运行(如chrome cannary 60 或Safari)




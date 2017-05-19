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
3. 模板jade:采用jade方式替代html
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

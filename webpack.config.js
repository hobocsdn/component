'use strict';

var path =require('path'),
    fs = require('fs');
var isProduct =  false;

module.exports = {
  devtool: (isProduct ? false : 'source-map')
  entry: [
        'webpack/hot/only-dev-server',
        './js/app.js'
    ],
    output: {
        path: './build',
        filename: 'bundle.js' //[name].js
    },
    module: {
        loaders: [
        { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
        { test: /\.css$/, loader: "style!css" },
        {test: /\.scss/,loader: 'style-loader!css-loader!sass-loader'}
        ]
    },
    resolve:{
        //进行文件的查找时，resolve属性中的extensions数组中用于配置程序可以自行补全哪些文件后缀
        extensions:['','.js','.json']
    },
    externals: {
      //第三方插件
     //"jquery": "jQuery"
   }
}

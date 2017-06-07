'@chartset utf-8';
/*
    程序入口：
    使用哪些component 哪些文件注册使用
    
*/

import utils from "./utils/utils.js"
import $ from "./utils/dom.js"
import Log4j from "./utils/log4j.js"
import WebContextInfo from "./utils/webContextInfo.js"
import Router from "./utils/router.js"

const log4j = new Log4j({
    level: "debug",
    appenders: {
        categoryName: "index.js"
    },
    postUrl: "/api/v1/exception"
});
console.log(log4j);

console.log("");

log4j.info("browser detector:", "----the browser support module---");

log4j.debug("this is debug level Info");
log4j.log("this is log level Info");
log4j.info("this is Info level Info", "connection", { name: "info" });
log4j.warn("this is warn level Info");
log4j.error("this is error level Info");

log4j.error(new Error());


const webContextInfo = new WebContextInfo();
log4j.info("webContextInfo:", webContextInfo.cacheInfo);


const components = [{
    name: "",
    title: "动画",
    src: "utils/animate.js",
    des: "测试js缓动动画",
    demo: ""
}];



class Component {
    constructor() {
        this.init();
    }
    init() {
        var e = document.getElementsByTagName("head")[0],
            t = document.createElement("link");
        t.href = "./css/component.css",
            t.rel = "stylesheet",
            e.appendChild(t);
    }
    register() {
        components.map(function(item) {
            this[item.name] = "";
        });
    }

};


const R = new Router();

R.route('/', function() {
    log4j.debug("this is home page");
});
R.route('/demo/animate', function() {
    log4j.debug("this is component page:animate");
});
R.route('/demo/tools', function() {
    log4j.debug("this is component page:tools");
});

R.route('/demo/tools', function() {
    log4j.debug("this is component page:tools cb show agian");
});

export default {
    $,
    utils,
    Component
};
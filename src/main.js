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
import jade from './utils/jade.js';
const log4j = new Log4j({
    level: "debug",
    appenders: {
        categoryName: "main.js"
    },
    postUrl: "/api/v1/exception"
});
console.log(log4j);

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
        components.map(function (item) {
            this[item.name] = "";
        });
    }

};


const R = new Router();

R.route('/', function () {
    log4j.debug("this is home page");
});
R.route('/demo/animate', function () {
    log4j.debug("this is component page:animate");
});
R.route('/demo/tools', function () {
    log4j.debug("this is component page:tools");
});

R.route('/demo/tools', (link) => {
    log4j.debug($(link));

    log4j.debug("this is component page:tools cb show agian");
});


export default {
    $,
    utils,
    Component
};

//jade 
const jadeCompile = ($el) => {
    try {
        let json;
        let j = $el.next("textarea.json");
        json = JSON.parse(j.val() || "{}");
        let val = $el.val();
        let trimIndent = (val) => {
            let template = val.split(/\n/);
            let len = template.length;
            if (len > 0) {
                let indent = template[0].match(/^\s+/);
                if (indent && indent.length) {
                    val = template.map(function (line) {
                        return line.replace(indent, "");
                    }).join("\n");
                }
            }
            return val;
        }
        val = trimIndent(val);
        return jade.compile(val, {
            pretty: !0,
            doctype: "5"
        })(json || {});
    } catch (l) {
        log4j.error("[json] " + l.message)
        return $el.parent(".row").find("textarea.html-output").val("[json] " + l.message),
            void 0
    }
}

try {
    const jadeToHtml = ($el) => {
        let html = jadeCompile($el);
        $el.parent(".row").find("textarea.html-output").val(html.trim());
    }
    $("textarea.jade-template").each((elem) => {
        let $jade = $(elem);
        jadeToHtml($jade);
        $jade.on("keyup", function () {
            jadeToHtml($jade);
        })
    });

    $("textarea.json").on("keyup", function () {
        let html = jadeCompile($(this).prev());
        log4j.debug(".json:keyup", html);
        return $(this).parent(".row").find("textarea.html-output").val(html.trim());
    });

} catch (e) {
    log4j.error(e.message);
}

let mouseEvent = ["mouseover", "mouseenter", "mousemove", "mousedown", "click", "mouseup", "mouseleave", "mouseout", "contextmenu", "dblclick"].join(" ")

//mouse event
//鼠标移入 mouseover ==> mouseenter ==>  mousemove+
$(".mouse-in").on("mouseover mouseenter mousemove", function (e) {
    e = e || event;
    log4j.debug("mouseEvent----", e.type);
    // if (e.type === "mouseover") {
    //     log4j.debug("mouseover --- before:", e.target, " --after:", e.relatedTarget);
    // }
    var $output = $(".mouse-in").parent(".row").find("textarea.html-output");
    var text = e.type === "mouseover" ? "" : $output.val();
    $output.val(text + "\n" + e.type);
});

//鼠标移出    mousemove+ ==>mouseout==>mouseleave
$(".mouse-out").on("mouseover mouseenter mousemove mouseleave mouseout", function (e) {
    e = e || event;
    log4j.debug("mouseEvent----", e.type);
    var $output = $(".mouse-out").parent(".row").find("textarea.html-output");
    var text = e.type === "mouseover" ? "" : $output.val();
    $output.val(text + "\n" + e.type);
});

$(".mouse-click").on(mouseEvent, function (e) {
    e = e || event;
    log4j.debug("mouseEvent----", e.type);
    var $output = $(".mouse-click").parent(".row").find("textarea.html-output");
    var text = e.type === "mouseover" ? "" : $output.val();
    $output.val(text + "\n" + e.type);
});
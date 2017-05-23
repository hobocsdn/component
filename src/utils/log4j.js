let VERSION = "1.0.0";
let merge = (...sources) => Object.assign(...sources);

/**
 * 日志级别,级别越高，输出的日志越少。比如：当前级别如果是WARN，则只输出ERROR,WARN的日志
 *
 * @type {{error: number, warn: number, info: number, log: number, debug: number}}
 */
let levelMap = {
    "error": 4,
    "warn": 3,
    "info": 2,
    "log": 1,
    "debug": 0
};

let __config = {
    debug: 0, //是否开启调试模式。如果开启调试模式，则可以在console中输入window.log4j进行调试；
    level: "debug", //日志级别，error(4)、warn(3)、info(2)、log(1)、debug(0),级别越高，输出的日志越少。
    tagFilter: "", //日志tag筛选,正则表达式字符串
    post: 0, //当发生异常是是否post到服务器
    postContextInfo: 1, //是否提交环境数据
    postUrl: "/api/exception" //异常信息提交的服务器地址
};

class Log4j {
    constructor(...args) {
        this.version = VERSION;
        this.config(...args);
    }
    config(...args) {
        if (arguments.length == 0)
            return this.__config;
        this.__config = merge(__config, ...args);
    }
    /*
     * 默认两个参数
     * @param {String} msg 输出信息
     * @param {String} tag 标记
     */
    log(...args) {
        this.exec("log", ...args);
    }
    info(...args) {
        this.exec("info", ...args);
    }
    warn(...args) {
        this.exec("warn", ...args);
    }
    error(...args) {
        this.exec("error", ...args);
    }
    debug(...args) {
        this.exec("debug", ...args);
    }
    exec(level, msg, tag) {
        let logLevel = levelMap[this.__config.level] || levelMap["debug"];

        if (logLevel > levelMap[level])
            return;
        let needLog = false;
        //过滤打印信息
        if (tag != undefined) {
            let reg = new RegExp(this.__config.tagFilter);
            needLog = reg.test(tag);
        } else {
            needLog = true;
        }
        if (needLog) {
            console ? console[level](msg) : !0;
            if (msg instanceof Error && this.__config.post) {
                this.post(msg); //上报服务器
            }
        }
    }
    post(msg) {
        let body = getPostData(msg);
        try {
            $.post(this.__config.postUrl, body);
        } catch (e) {
            console ? console.error(e) : !0;
        }
    }

    getPostData(msg) {
        let body = {};
        if (this.__config.postContextInfo) {
            body = new WebContextInfo();
        }
        if (msg instanceof Error) {
            body = merge(body, { name: msg.name, message: msg.message, stack: msg.stack });
        } else {
            body = merge(body, { name: "", message: msg + "", stack: "" });
        }
        return body;
    }
}

export default Log4j;

/*
```
let log4j = new Log4j({
    level: "debug", //日志级别，error(4)、warn(3)、info(2)、log(1)、debug(0),级别越高，输出的日志越少。
    tagFilter: "", //日志tag筛选,正则表达式字符串
    post: 0, //当发生异常是是否post到服务器
    postContextInfo: 1, //是否提交环境数据
    postUrl: "/api/exception" //异常信息提交的服务器地址
});

```
*/
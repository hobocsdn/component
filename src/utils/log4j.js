let VERSION = "1.0.0";
let merge = (...sources) => Object.assign(...sources);
let formatDate = (date, format = "yyyy-MM-dd hh:mm:ss") => {
        if (!date || !(date instanceof Date)) {
            date = new Date();
        }
        let o = {
            "[Y|y]+": date.getFullYear(),
            "M+": date.getMonth() + 1,
            "[D|d]+": date.getDate(),
            "[H|h]+": date.getHours(),
            "m+": date.getMinutes(),
            "s+": date.getSeconds(),
            "[Q|q]+": Math.floor((date.getMonth() + 3) / 3),
            "S": date.getMilliseconds()
        };
        for (var k in o) {
            if (o.hasOwnProperty(k)) {
                var reg = new RegExp("(" + k + ")").test(format);
                if (!reg) {
                    continue;
                }
                var str = o[k].toString();
                format = format.replace(RegExp.$1, (RegExp.$1.length !== 2) ? str : ("00" + str).substr(str.length));
            }
        }
        return format;
    }
    /**
     * 日志级别,级别越高，输出的日志越少。比如：当前级别如果是WARN，则只输出ERROR,WARN的日志
     *
     * @type {{error: number, warn: number, info: number, log: number, debug: number}}
     */
let levelMap = {
    "fatal": 5,
    "error": 4,
    "warn": 3,
    "info": 2,
    "log": 1,
    "debug": 0
};

let __config = {
    type: "console", //file nodejs使用
    debug: 0, //是否开启调试模式。如果开启调试模式，则可以在console中输入window.log4j进行调试；
    level: "debug", //日志级别，error(4)、warn(3)、info(2)、log(1)、debug(0),级别越高，输出的日志越少。
    tagFilter: "", //日志tag筛选,正则表达式字符串
    postContextInfo: false, //是否提交环境数据
    postUrl: "", //当发生异常是是否post到服务器/异常信息提交的服务器地址
    appenders: { //输出信息前缀
        categoryName: "log_file",
        dateFormat: "yyyy-MM-dd hh:mm:ss"
    }
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
    exec(level, ...args) {
        let tag = "";
        let logLevel = levelMap[this.__config.level] || levelMap["debug"];
        let msgPrefix = this.getMsgPrefix(level);
        if (logLevel > levelMap[level])
            return;
        let needLog = true;
        //过滤打印信息
        // if (this.__config.tagFilter) {
        //   let reg = new RegExp(this.__config.tagFilter);
        //   needLog = reg.test(msg);
        // } else {
        //   needLog = true;
        // }

        if (needLog) {
            console ? console[level](msgPrefix, ...args) : !0;
            //error 级别上报服务器
            let info = [...args];
            let isExitError = info.some(function(item) {
                return item instanceof Error;
            })
            if (isExitError && this.__config.postUrl) {
                console.info(new Date(), "this info will be send to sever.", ...args);
                this.post(...args); //上报服务器
            }
        }
    }
    post(...args) {
        let body = this.getPostData(...args);
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
            body = merge(body, {
                exceptionTime: this.getMsgPrefix("error"),
                name: msg.name,
                message: msg.message,
                stack: msg.stack
            });
        } else {
            body = merge(body, {
                name: "",
                message: msg + "",
                stack: ""
            });
        }
        return body;
    }
    setLevel(level) {
        this.__config.level = level;
    }
    getMsgPrefix(level) {
        let categoryName = this.__config.appenders.categoryName;
        let startTime = formatDate(new Date());
        return `[${startTime}] [${level}] ${categoryName} - `;
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
log4j.info("this is Info level Info");

```
*/
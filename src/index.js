import utils from "./utils/utils"
import $ from "./utils/dom"
import Log4j from "./utils/log4j"
import WebContextInfo from "./utils/webContextInfo"

const log4j = new Log4j({
    level: "debug",
    appenders: {
        categoryName: "index.js"
    },
    postUrl: "/api/v1/exception"
});

log4j.info("browser detector:", "this browser not support ES6 module ,so it use the bundle.js");

log4j.debug("this is debug level Info");
log4j.log("this is log level Info");
log4j.info("this is Info level Info", "connection", { name: "info" });
log4j.warn("this is warn level Info");
log4j.error("this is error level Info");

log4j.error(new Error());


const webContextInfo = new WebContextInfo();
log4j.info("webContextInfo:", webContextInfo.cacheInfo);

window.$ = $;

window.utils = utils;

export default {
    $,
    utils
};
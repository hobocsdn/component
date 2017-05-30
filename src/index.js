import utils from "./utils/utils.js"
import $ from "./utils/dom.js"
import Log4j from "./utils/log4j.js"
import WebContextInfo from "./utils/webContextInfo.js"

const log4j = new Log4j({
  level: "warn",
  appenders: {
    categoryName: "index.js"
  },
  postUrl: "/api/v1/exception"
});
console.log(log4j);

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
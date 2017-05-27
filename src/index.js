import utils from "./utils/utils"
import dom from "./utils/dom"
import Log4j from "./utils/log4j"
import WebContextInfo from "./utils/webContextInfo"

const log4j = new Log4j({
    level: "info",
    appenders:{
      categoryName:"index.js"
    },
    postUrl:"/api/v1/exception"
});
console.log(log4j);

log4j.debug("this is debug level Info");
log4j.log("this is log level Info");
log4j.info("this is Info level Info","connection",{name:"info"});
log4j.warn("this is warn level Info");
log4j.error("this is error level Info");

log4j.error(new Error());


const webContextInfo = new WebContextInfo();
log4j.info("webContextInfo:", webContextInfo.cacheInfo);

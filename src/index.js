import utils from "./utils/utils"
import Log4j from "./utils/log4j"
import WebContextInfo from "./utils/utils"

const log4j = new Log4j({
    level: "warn"
});
console.log(log4j);
log4j.debug("this is debug level Info");
log4j.log("this is log level Info");
log4j.info("this is Info level Info");
log4j.warn("this is warn level Info");
log4j.error("this is error level Info");
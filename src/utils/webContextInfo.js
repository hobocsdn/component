class WebContextInfo {
    constructor() {
        this.cacheInfo = {};
        this.url();
        this.referrer();
        this.resolution();
        this.browser();
        this.os();
    }

    /**
     * 获取当前url
     * @returns {string|window.location.href|*}
     */
    url() {
        return this.cacheInfo.url = document.location.href;
    }

    /**
     * 获取上一个访问页面
     * @returns {*}
     */
    referrer() {
        return this.cacheInfo.referrer = document.referrer;
    }

    /**
     * 获取屏幕分辨率信息
     * @returns {string}
     */
    resolution() {
        return this.cacheInfo.resolution = window.screen.width + "*" + window.screen.height;
    }

    /**
     * 获取操作系统信息(待更新)
     * @returns {string}
     */
    os() {
        var ret = "Unknown";
        var sUA = navigator.userAgent.toLowerCase();
        if (sUA.indexOf('win') != -1) {
            ret = "Windows";
        } else if (sUA.indexOf('linux') != -1) {
            ret = 'Linux';
        } else if (sUA.indexOf('mac') != -1) {
            ret = "Mac";
        }
        return this.cacheInfo.os = ret;
    }

    /**
     * 获取浏览器信息
     * @returns {string}
     */
    browser() {
        let br = { type: "Unknown", version: "0" };
        let explorer = window.navigator.userAgent.toLowerCase();
        if (explorer.indexOf("msie") >= 0) {
            let ver = explorer.match(/msie ([\d.]+)/)[1];
            br = { type: "IE", version: ver };
        } else if (explorer.indexOf("firefox") >= 0) {
            let ver = explorer.match(/firefox\/([\d.]+)/)[1];
            br = { type: "Firefox", version: ver };
        } else if (explorer.indexOf("chrome") >= 0) {
            let ver = explorer.match(/chrome\/([\d.]+)/)[1];
            br = { type: "Chrome", version: ver };
        } else if (explorer.indexOf("opera") >= 0) {
            let ver = explorer.match(/opera.([\d.]+)/)[1];
            br = { type: "Opera", version: ver };
        } else if (explorer.indexOf("Safari") >= 0) {
            let ver = explorer.match(/version\/([\d.]+)/)[1];
            br = { type: "Safari", version: ver };
        }
        return this.cacheInfo.browser = br.type + "," + br.version;
    }
}

export default WebContextInfo;
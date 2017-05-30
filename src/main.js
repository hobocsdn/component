'@chartset utf-8';
/*
    程序入口：
    使用哪些component 哪些文件注册使用
    
*/

const components = [];
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

};

export default Component;

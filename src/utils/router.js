/*简单实现路由原理*/

class Router {
    constructor() {
        this.routes = {};
        this.curUrl = {};
        this.init();
    }
    init() {
        window.addEventListener('load', this.refresh.bind(this), false);
        window.addEventListener('hashchange', this.refresh.bind(this), false);
    }
    refresh() {
        this.path = location.hash.replace(/#([^#]*)(#.*)?/, './$1') || "./"; //用于发送http请求
        this.curUrl = location.hash.slice(1) || `/`;
        let linkTo = `#${this.curUrl}`
        let cbList = this.routes[this.curUrl]; //执行路由回调;
        if (cbList && cbList instanceof Array) {
            cbList.forEach((cb) => {
                cb(linkTo);
            })
        }
    }
    route(path, cb) {
        let cbList = this.routes[path];
        if (cbList && cbList instanceof Array) {
            this.routes[path].push(cb);
        } else {
            this.routes[path] = [cb || function () { }];
        }
    }

}

export default Router;
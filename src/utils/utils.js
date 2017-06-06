let class2type = {};
"Boolean Number String Function Array Date RegExp Object Error".split(" ").forEach(function(name) {
    class2type["[object " + name + "]"] = name.toLowerCase();
});


/*
    return：min~max
*/
//Math.random(0~1 随机数)、Math.ceil(向上取整 min~max)、Math.floor(min-1~ max)、Math.round(min-1~ max+1
//硬币正反面(随机产生0,1)
let random = (max, min) => {
    if (min === undefined) min = 0;
    return Math.round(Math.random() * (max - min) + min);
}

//颜色
let randomColor = function(color) {
    let charCode = '0123456789abcdef';
    if (color === undefined) color = '#';
    color += charCode[Math.floor(Math.random() * 16)];
    if (color.length == 7) {
        return color;
    } else {
        return arguments.callee(color);
    }
}

// 获取对象中某几个属性的值 以数组形式返回 object to arry
let obj2Arr = (obj = {}, keys = []) => {
    // 类数组： [].slice.call(arrayLike); Array.from(arrayLike);
    // 全返回
    if (keys.length) {
        keys = Object.keys(obj);
    }
    let res = [];
    keys.forEach(function(key) {
        res.push(obj[key]);
    });
    return res
}

let type = (obj) => {
    if (obj == null) {
        return obj + "";
    }
    toString = Object.prototype.toString;
    return typeof obj === "object" || typeof obj === "function" ?
        class2type[toString.call(obj)] || "object" :
        typeof obj;
}


/*
 * 对象数组排序
 * @param {String} firstKey 优先排序
 * @param {String} secondKey 次要排序(firstKey相等(包含undefined)
 * @param {String} dataType 数据类型
 * @param {Boolean} asc 升序
 */
let sortBy = (opts) => {
    let firstKey = opts.firstKey;
    let secondKey = opts.secondKey;
    let dataType = opts.dataType;
    let asc = opts.asc ? -1 : 1;
    let comparer = function(a, b) {
        var av = a[firstKey];
        var bv = b[firstKey];
        if (av !== bv) {
            if (av > bv || av === void 0) return 1;
            if (av < bv || bv === void 0) return -1;
        }
        return asc * (a[secondKey] - b[secondKey]);
    };
    let dateComparer = function(a, b) {
        let d1 = new Date(a[firstKey]);
        let d2 = new Date(b[firstKey]);
        let dt1 = av.getTime();
        let dt2 = bv.getTime();
        if (dt1 === dt2 || (isNaN(dt1) && isNaN(dt2))) {
            return asc * (a[secondKey] - b[secondKey]);
        } else {
            if (av > bv || av === void 0) return 1;
            if (av < bv || bv === void 0) return -1;
        }
    };
    let handlers = {
        number: comparer,
        string: comparer,
        date: dateComparer
    }
    return handlers[dataType] || comparer;
}

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

function isPlainObject(obj) {
    return Object.prototype.toString.call(obj) === "";
}

function hasOwn(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}

//浅拷贝
let merge = (...sources) => Object.assign(...sources);

//["?name=jawil", "jawil", index: 0, input: "?name=jawil&age=23"]
/*
 * 对象数组排序
 * @param {String} attr 获取url属性
 * 
 * return {String} url中+号表示空格,要替换掉
 */
let parseUrl = (attr) => {
    let url = window.location.search;
    let ret = {
        source: url,
        protocol: url.protocol.replace(":", ""),
        host: url.hostname,
        port: url.port,
        query: url.search,
        hash: url.hash.replace("#"),
        param(attr) {
            let match = RegExp(`[?&]${attr}=([^&]*)`)
                .exec(url)
            return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
        }
    }
    if (attr) {
        return ret.param(attr);
    }
    return ret;

}

//数字格式化
let numberFormat = (num) => {
    var n = Object.prototype.toString.call(null, num);
    return n.replace(/\B(?=(\d{3})+(?!\d))/g, ','); //?=xxx ?!xxx匹配的是边界
}

export default {
    random,
    randomColor,
    sortBy,
    type,
    obj2Arr,
    formatDate,
    hasOwn,
    isPlainObject,
    merge,
    parseUrl
}
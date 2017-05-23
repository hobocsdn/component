

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

let $ = (ele) => {
    return document.querySelector(ele);
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

export default {
  $,
  random,
  randomColor,
  sortBy,
  type,
  obj2Arr
}

/*
  简易版jquery
  1. 选择器
  2.样式操作: addClass removeClass hasClass
  3. 事件注册: on off once 
  4. each 遍历 
*/


const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
const MOZ_HACK_REGEXP = /^moz([A-Z])/;
const ieVersion = Number(document.documentMode);
const extend = (...sources) => Object.assign(...sources);

const trim = function (string) {
  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
};

/* istanbul ignore next */
const camelCase = function (name) {
  return name.replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
    return offset ? letter.toUpperCase() : letter;
  }).replace(MOZ_HACK_REGEXP, 'Moz$1');
};

const on = (function () {
  if (document.addEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false);
      }
    };
  } else {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler);
      }
    };
  }
})();

/* istanbul ignore next */
const off = (function () {
  if (document.removeEventListener) {
    return function (element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false);
      }
    };
  } else {
    return function (element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler);
      }
    };
  }
})();

/* istanbul ignore next */
const once = function (el, event, fn) {
  var listener = function () {
    if (fn) {
      fn.apply(this, arguments);
    }
    off(el, event, listener);
  };
  on(el, event, listener);
};

function hasClass(el, cls) {
  if (!el || !cls) return false;
  if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.');
  if (el.classList) {
    return el.classList.contains(cls);
  } else {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
  }
};

function addClass(el, cls) {
  if (!el) return;
  var curClass = el.className;
  var classes = (cls || '').split(' ');

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.add(clsName);
    } else {
      if (!hasClass(el, clsName)) {
        curClass += ' ' + clsName;
      }
    }
  }
  if (!el.classList) {
    el.className = curClass;
  }
};

function removeClass(el, cls) {
  if (!el || !cls) return;
  var classes = cls.split(' ');
  var curClass = ' ' + el.className + ' ';

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.remove(clsName);
    } else {
      if (hasClass(el, clsName)) {
        curClass = curClass.replace(' ' + clsName + ' ', ' ');
      }
    }
  }
  if (!el.classList) {
    el.className = trim(curClass);
  }
};

const css = function (element, styleName, value) {
  if (!element || !styleName) return;

  if (typeof styleName === 'object') {
    for (var prop in styleName) {
      if (styleName.hasOwnProperty(prop)) {
        css(element, prop, styleName[prop]);
      }
    }
  } else {
    styleName = camelCase(styleName);
    if (styleName === 'opacity' && ieVersion < 9) {
      element.style.filter = isNaN(value) ? '' : 'alpha(opacity=' + value * 100 + ')';
    } else {
      element.style[styleName] = value;
    }
  }
};


const merge = function (first, second) {
  let len = +second.length,
    j = 0,
    i = first.length;

  for (; j < len; j++) {
    first[i++] = second[j];
  }
  first.length = i;
  return first;
}


class Jquery {
  constructor() {
  }
  init(selector) {
    this.length = 0;
    if (!selector) {
      return this;
    } else {
      let elem = document.querySelectorAll(selector);
      if (elem !== null) {
        this.merge(this, elem);
        return this;
      }
    }
  }
}

Jquery.fn = Jquery.prototype

Object.assign(Jquery.fn, {
  each(cb) {
    let self = this;
    let len = this.length, i = 0;
    for (; i < len; i++) {
      cb.call(this, this[i]);
    }
  },
  on(event, handler) {
    return this.each(function (ele) {
      on(ele, event, handler);
    });
  },
  off(event, handler) {
    return this.each(function (ele) {
      on(ele, event, handler);
    });
  },
  once(event, handler) {
    return this.each(function (ele) {
      once(ele, event, handler);
    });
  },
  addClass(event, handler) {
    return this.each(function (ele) {
      addClass(ele, event, handler);
    });
  },
  removeClass(cls) {
    return this.each(function (ele) {
      removeClass(ele, cls);
    });
  },
  hasClass(cls) {
    var ret = [];
    this.each(function (ele) {
      ret.push(hasClass(ele, cls));
    });

    return ret.every(function (ele) {
      return ele;
    });
  },
  css() {

  },
  merge//类数组合并
});

Jquery.fn.init.prototype = Jquery.fn;

const $ = function (ele) {
  return new Jquery.fn.init(ele);
}

export default $
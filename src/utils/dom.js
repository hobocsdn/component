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
  each(cb) {
    let self = this;
    let len = this.length, i = 0;
    for (; i < len; i++) {
      cb.call(this[i], this[i]);
    }
  }
  on(event, handler) {
    return this.each(function (elem) {
      let events = event.split(/\s+/g);
      events.forEach(function (e) {
        on(elem, e, handler);
      });
    });
  }
  off(event, handler) {
    return this.each(function (elem) {
      on(elem, event, handler);
    });
  }
  once(event, handler) {
    return this.each(function (elem) {
      once(elem, event, handler);
    });
  }
  addClass(event, handler) {
    return this.each(function (elem) {
      addClass(elem, event, handler);
    });
  }
  removeClass(cls) {
    return this.each(function (elem) {
      removeClass(elem, cls);
    });
  }
  hasClass(cls) {
    var ret = [];
    this.each((elem) => {
      ret.push(hasClass(elem, cls));
    });

    return ret.every(function (elem) {
      return elem;
    });
  }
  css(attrName, attrValue) {
    let ret = null;
    this.each((elem) => {
      if (typeof attrName === 'object') {
        for (var key in attrName) {
          key = camelCase(key);
          elem.style[key] = attrName[key];
        }
      } else if (attrValue) {
        elem.style[camelCase(attrName)] = attrValue;
      } else {
        ret = window.getComputedStyle(elem)[attrName];
      }
    });
    return ret ? ret : this;
  }
  val(o) {
    if (o === undefined) {
      let elem = this[0];
      if (elem && elem.nodeType === 1) {
        return elem.value;
      }
      return undefined;
    }
    return this.each((elem) => {
      elem.value = o;
    });
  }

  next() {
    let ret = [];
    this.each((elem) => {
      let cur = elem, dir = "nextSibling";
      while ((cur = cur[dir]) && cur.nodeType !== 1) { }
      cur && ret.push(cur);
    });
    return $(ret);
  }
  prev() {
    let ret = [];
    this.each((elem) => {
      let cur = elem, dir = "previousSibling";
      while ((cur = cur[dir]) && cur.nodeType !== 1) { }
      cur && ret.push(cur);
    });
    return $(ret);
  }
  parent(selector) {
    selector = selector && (selector.replace(/\.|#/g, ''));
    var parent = this[0].parentNode;
    while (parent && selector) {
      if (parent.className && (parent.className.indexOf(selector) > -1 || selector === parent.id)) {
        return $(parent)
      }
      parent = parent.parentNode;
    }
    return $(parent);
  }
  siblings(elem) {
    let brother = (n, elem) => {
      var matched = [];
      for (; n; n = n.nextSibling) {
        if (n.nodeType === 1 && n !== elem) {
          matched.push(n);
        }
      }
      return matched;
    };
    return $(brother($(this[0].parentNode.firstChild), elem));
  }
  before(dom) {
    this.each(function (elem) {
      elem.parentNode.insertBefore(dom, elem);
    });
    return this;
  }

  text(val) {
    return this[0].textContent = val;
  }
  find(selector) {
    let elem = this[0].querySelectorAll(selector);
    return $(elem);
  }
};


class Dom extends Jquery {
  constructor(selector) {
    super();
    this.length = 0;

    if (typeof selector === 'string') {
      var elem = document.querySelectorAll(selector);
      var i, len = elem ? elem.length : 0;
      merge(this, elem);
      this.selector = selector || '';
      return this;
    } else if (selector instanceof NodeList) {
      var i, len = selector ? selector.length : 0;
      merge(this, selector);
      this.length = len;
      this.selector = '';
    } else if (selector && selector.nodeType) {
      this.context = this[0] = selector;
      this.length = 1;
      this.selector = selector || '';
    }
    return merge(this, selector || []), this;
  }
  show() {
    this.css({ "dispay": "block" });
  }
  hide() {
    this.css({ "dispay": "none" });
  }
}

const $ = function (elem) {
  return new Dom(elem);
}
export default $

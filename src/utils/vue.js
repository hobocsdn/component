/*参考Vue数据监听方式 setter getter*/
/*
  1. 创建一个观察对象，
   - 更改所有属性的getter setter ，调用setter时通知notify所有订阅者
   - dep 管理所有订阅者

*/

/*观测器*/
class Observer {
  constructor(value) {
    this.value = value;
    this.dep = new Dep();
    this.vmCount = 0;

    //将对象变为被观察对象
    def(value, '__ob__', this);

    //监测该对象所有属性，改用setter getter 访问属性
    if (Array.isArray(value)) {
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  }
  walk(obj) {
    let keys = Object.keys(obj);
    keys.forEach(function(key, index) {
      defineReactive(obj, key, obj[key]);
    });
  }
  observeArray(items) {
    items.forEach(function(item, i) {
      observe(item);
    });
  }
}

/*重新定义值的访问方式*/
function defineReactive(obj, key, val) {
  let dep = new Dep(); //订阅管理类
  /*Object.getOwnPropertyDescriptor:返回指定对象上一个自有属性对应的属性描述符。（自有属性指的是直接赋予该对象的属性，不需要从原型链上进行查找的属性）*/
  let property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  let getter = property && property.getter;
  let setter = property && property.setter;

  let childOb = observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter(val) {
      let value = getter ? getter.call(Obj) : val;
      let watcher = Dep.target;
      if (watcher) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
        }
      }
      return value;
    },
    set: function reactiveSetter(newVal) {
      let value = getter ? getter.call(Obj) : val;
      if (setter) {
        setter.call(Obj, newVal);
      } else {
        val = newVal;
      }
      /*添加值的监控*/
      childOb = observe(newVal);
      //通知所有订阅者
      dep.notify();
    },
  })
}

let targetStack = [];
let uid = 0
//属性监听订阅管理
class Dep {
  constructor() {
    this.id = uid++;
    this.subs = [];
  }
  static target: null
  addSub(watcher) { // 添加订阅者
    this.subs.push(watcher);
  }
  removeSub(watcher) {
    var watcher = this.subs;
    if (subs.length) {
      const index = subs.indexOf(watcher)
      if (index > -1) {
        return subs.splice(watcher, 1);
      }
    }
  }
  depend() {
    var watcher = Dep.target;
    if (watcher) {
      watcher.addDep(this); //
    }
  }
  notify() {
    //通知所有订阅者
    var subs = this.subs.slice();
    for (let i = 0, l = subs.length; i < l; i++) {
      var watcher = subs[i];
      watcher.update();
    }
  }
}

// 创建监听实例:就是给对象的所有属性加上 getter、setter，如果对象的属性还有属性递归
let observe = function(data) {
  //data必须为普通对象或数组
  let ob;
  if (hasOwn(data, '__ob__' && data.__ob__ instanceof Observer)) {
    ob = data.__ob__
  } else if (Array.isArray(data) || isPlainObject(data)) {
    ob = new Observer(data);
  }
  return ob;
}
let hasOwn = function(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

function def(obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}

function isPlainObject(obj) {
  return Object.prototype.toString.call(obj) === "[object Object]"
}

/*代理 target访问key 实际为sourceKey属性*/
function proxy(target, sourcekey, key) {
  let sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    set: function proxySetter(newVal) {
      this[sourcekey][key] = newVal;
    },
    get: function proxyGetter() {
      return this[sourcekey][key];
    }
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

/*观察者管理*/
class Watcher {
  constructor(vm, key, cb) {
    this.vm = vm;
    this.key = key;
    this.cb = cb;
    this.deps = [];
    this.depIds = [];
    this.value = this.get(); //实例化时巧妙的利用属性访问getter 将订阅者添加到属性的Dep 管理
  }
  get() {
    Dep.target = this;
    var value = this.vm._data[this.key];
    Dep.target = null;
    return value;
  }
  update() {
    this.run();
  }
  run() { //执行回调
    this.cb.call(this.vm);
  }
  addDep(dep) {
    //监控对象依赖收集管理
    //根据属性id 去重 添加监听
    if (this.depIds.indexOf(dep.id) === -1) {
      this.depIds.push(dep.id);
      this.deps.push(dep);
      dep.addSub(this); //属性依赖添加观察者
    }
  }
}
/*关联watcher observer*/


class Vue {
  constructor(opts) {
    let vm = this;
    this.$options = opts;
    opts.data && this.initData(vm);
    opts.watch && this.initWatch(vm, opts.watch);
  }
  initData(vm) {
    let data = vm.$options.data;
    data = vm._data = data.call(this);
    let keys = Object.keys(data);
    let i = keys.length;
    while (i--) {
      proxy(vm, '_data', keys[i]); //代理访问 _data
    }
    observe(data);
  }
  initWatch(vm, watch) {
    /* @watch
       {
          attribution1:Object,
          {
              handler:Function,
              immediate:Boolean //是否立即处理
          }
          attribution2:Function
        }
    */
    const keys = Object.keys(watch);
    keys.forEach(function(key, index) {
      var options = watch[key];
      vm.$watch(vm, key, options);
    });
  }
  $watch(vm, key, handler) {
    let options = handler;
    if (isPlainObject(handler)) {
      let cb = handler.handler;
    } else if (typeof handler === 'string') {
      cb = vm[handler];
    } else if (typeof handler === 'function') {
      cb = handler;
    }
    let watcher = new Watcher(vm, key, cb, options);
    if (options.immediate) {
      cb.call(vm, watcher.value);
    }
    return watcher;
  }
  toString() {
    return "[Object VM]";
  }
}

window.app = new Vue({
  data() {
    return {
      message: 'message',
      test: 'test'
    }
  },
  watch: {
    message: {
      handler: function() {
        console.log('message has been changed');
      },
      immediate: true
    },
    test: function() {
      console.log('test has been changed');
    }
  }
});

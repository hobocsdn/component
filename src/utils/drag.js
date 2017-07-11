
/*
    实现原理
    鼠标事件 mousedown mousemove mouseup
    
*/
import $ from "./dom.js"

class Drag {
    constructor(elem, target, callback) {
        this.$el = $(elem);
        this.target = target;
        this.option = {
            left: this.target.css("left"),
            top: this.target.css("top"),
            currentX: 0,
            currentY: 0,
            flag: false
        };
        this.timer = null;
        this.mousemoveCb = callback;
        //在mousedown中注册mousemove mouseup
        //在mouseup中移除mouseup 和mousemove
        this.$el.on("mousedown", this.mousedown.bind(this));
        $(document).on("mousemove", this.mousemove.bind(this));
        $(document).on("mouseup", this.mouseup.bind(this));
        this.$el.on("selectstart", () => {
            return false;
        });
    }
    mousedown(e) {
        e = e || event;
        this.option.flag = true;
        //记录下鼠标当前的位置
        this.option.currentX = e.clientX;
        this.option.currentY = e.clientY;
    }
    mouseup(e) {
        e = e || event;
        this.option.flag = false;
        //更新位置
        this.option.top = this.target.css("top");
        this.option.left = this.target.css("left");
    }
    mousemove(e) {
        e = e || event;
        //移动响应过慢 mouseup事件不在bar上触发
        if (this.option.flag) {
            let currentX = e.clientX;
            let currentY = e.clientY;
            let disX = currentX - this.option.currentX;
            let disY = currentY - this.option.currentY;
            //鼠标移动距离

            // this.timer = setTimeout(() => {
            this.target.css({
                left: parseInt(this.option.left) + disX + `px`,
                top: parseInt(this.option.top) + disY + `px`
            });
            // }, 100);
            if (e.preventDefault) {
                e.preventDefault();
            }
            return false;
        }
        if (this.mousemoveCb) {
            this.mousemoveCb.call(this);
        }
    }
    releaseDrag() {
        this.off("mousedown");
        this.off("mousemove");
        this.off("mouseup");
    }
}

export default Drag;
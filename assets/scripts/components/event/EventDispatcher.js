/*
事件派发器
支持一对多的事件派发
*/

cc.Class({
    properties: {
        _dispatcher: { default: null, type: cc.EventTarget }
    },

    ctor() {
        this._dispatcher = new cc.EventTarget();
    },

    on(name, callback, target) {
        target = target || this;
        this._dispatcher.on(name, callback, target);
    },
    emit(name, params) {
        this._dispatcher.emit(name, params);
    },
    off(name, callback, target) {
        target = target || this;
        this._dispatcher.off(name, callback, target);
    },
    targetOff(target) {
        target = target || this;
        this._dispatcher.targetOff(target);
    },

    addEvent(name, callback, target) {
        target = target || this;
        this.on(name, callback, target);
    },

    dispatchEvent(name, params) {
        this.emit(name, params);
    },

    removeEvent(name, callback, target) {
        this.off(name, callback, target);
    },

    removeTargetEvent(target) {
        this.targetOff(target);
    }
});
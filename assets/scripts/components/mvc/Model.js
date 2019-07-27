
/*
缓存基类
*/

cc.Class({
    properties: {
        _dispatcher: { default: null, type: cc.EventTarget }
    },

    ctor() {
        this._dispatcher = new cc.EventTarget();
    },

    emit(name, params) {
        this._dispatcher.emit(name, params);
    },

    on(name, callback, target) {
        target = target || this;
        this._dispatcher.on(name, callback, target);
    },

    off(name, callback, target) {
        target = target || this;
        this._dispatcher.off(name, callback, target);
    },

    targetOff(target) {
        this._dispatcher.targetOff(target);
    }
});

/*
控制器基类
*/

cc.Class({
    properties: {
        _view: null,
        view: {
            get() {
                return this._view;
            }
        },

        root: {
            get() {
                return ya.layer.view;
            }
        },

        _model: null,
        model: {
            get() {
                return this._model;
            },
            set(m) {
                this._model = m;
            }
        },

        _events: [],
    },

    ctor() {
        this.initGlobalEvent();
    },

    initModel() {

    },
    
    //初始化全局事件监听
    initGlobalEvent() {
        //这里使用addGlobalEvent添加事件
    },

    //控制器事件，随着主view销毁而销毁
    initModuleEvent() {
        //这里使用addModuleEvent添加事件
        //销毁事件时使用clearModuleEvent
    },

    //override
    initView(params) {
        return null;
    },

    show(params) {
        if (!this._view) {
            this._view = this.initView(params);
            if (!this._view) return null;

            this.root.addChild(this._view.node);

            this.initModel();
            this.initModuleEvent();
        }
        else {
            if (!this._view.active) {
                this._view.active = true;
            }
        }
        return this._view;
    },

    remove() {
        if (this._view) {
            this.clearModuleEvent();

            this._view.node.destroy();
            this._view = null;
        }
    },
    hide() {
        if (this._view && this._view.node.active) {
            this._view.node.active = false;
        }
    },
    display() {
        if (this._view && !this._view.node.active) {
            this._view.node.active = true;
        }
    },

    addGlobalEvent(name, callback, target) {
        target = target || this;
        ya.event.on(name, callback, target);
    },

    addModuleEvent(name, callback, target) {
        this.addGlobalEvent(name, callback, target);
        this._events.push(name);
    },

    clearModuleEvent() {
        for (let i = 0; i < this._events.length; i++) {
            ya.event.off(this._events[i]);
        }
        this._events.length = 0;
    },
});
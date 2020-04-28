/*
事件派发器
支持一对多的事件派发
*/

const {ccclass, property} = cc._decorator;

@ccclass
export default class YAEventDispatcher {
    @property(cc.EventTarget)
    private dispatcher: cc.EventTarget = null;

    private static _instance: YAEventDispatcher = null;
    static getInstance (): YAEventDispatcher {
        if (this._instance) {
            this._instance = new YAEventDispatcher();
        }
        return this._instance;
    }

    private constructor () {
        this.dispatcher = new cc.EventTarget();
    }
    
    on (name: string, callback: Function, target?: any) {
        target = target || this;
        this.dispatcher.on(name, callback, target);
    }

    emit (name: string, params?: any) {
        this.dispatcher.emit(name, params);
    }

    off (name: string, callback?: Function, target?: any) {
        if (!callback) {
            this.dispatcher.off(name);
        }
        else if (!target) {
            this.dispatcher.off(name, callback);
        }
        else {
            this.dispatcher.off(name, callback, target);
        }
    }

    targetOff (target?: any) {
        target = target || this;
        this.dispatcher.targetOff(target);
    }

    addEvent (name: string, callback: Function, target?: any) {
        target = target || this;
        this.on(name, callback, target);
    }

    dispatchEvent (name: string, params?: any) {
        this.emit(name, params);
    }

    removeEvent (name: string, callback?: Function, target?: any) {
        this.off(name, callback, target);
    }

    removeTargetEvent (target: any) {
        this.targetOff(target);
    }
}

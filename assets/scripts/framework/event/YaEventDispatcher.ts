/*
事件派发器
支持一对多的事件派发
*/

import {Singleton} from "../singleton/Singleton";

class YaEventDispatcher extends Singleton<YaEventDispatcher> {
    private _dispatcher: cc.EventTarget = null;

    public init() {
        this._dispatcher = new cc.EventTarget();
    }

    public add(name: string, callback: (args) => void, target?: any) {
        target = target || this;
        this._dispatcher.on(name, callback, target);
    }

    public dispatch(name: string, args?: any) {
        this._dispatcher.emit(name, args);
    }

    public remove(name: string, callback?: (args) => void, target?: any) {
        if (!callback) {
            this._dispatcher.off(name);
        } else if (!target) {
            this._dispatcher.off(name, callback);
        } else {
            this._dispatcher.off(name, callback, target);
        }
    }

    public removeTarget(target: any) {
        target = target || this;
        this._dispatcher.targetOff(target);
    }
}

const yaEventDispatcher = YaEventDispatcher.instance(YaEventDispatcher);
export {yaEventDispatcher};

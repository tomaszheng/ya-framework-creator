/*
事件派发器
支持一对多的事件派发
*/

import {Singleton} from "../singleton/Singleton";

class EventDispatcher extends Singleton<EventDispatcher> {
    private readonly _dispatcher: cc.EventTarget = new cc.EventTarget();

    public on(name: string, callback: (args) => void, target?: any) {
        target = target || this;
        this._dispatcher.on(name, callback, target);
    }

    public off(name: string, callback?: (args) => void, target?: any) {
        if (!callback) {
            this._dispatcher.off(name);
        } else if (!target) {
            this._dispatcher.off(name, callback);
        } else {
            this._dispatcher.off(name, callback, target);
        }
    }

    public emit(name: string, args?: any) {
        this._dispatcher.emit(name, args);
    }

    public targetOff(target: any) {
        target = target || this;
        this._dispatcher.targetOff(target);
    }
}

const eventDispatcher = EventDispatcher.instance(EventDispatcher);
export {eventDispatcher};

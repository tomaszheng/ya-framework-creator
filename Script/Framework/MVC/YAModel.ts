
/*
缓存基类
*/

export default class YAModel {
    dispatcher: cc.EventTarget;
    
    constructor() {
        this.dispatcher = new cc.EventTarget();
    }

    emit (name: string, params?: any) {
        this.dispatcher.emit(name, params);
    }

    on (name: string, callback: Function, target?: any) {
        target = target || this;
        this.dispatcher.on(name, callback, target);
    }

    off (name: string, callback: Function, target?: any) {
        target = target || this;
        this.dispatcher.off(name, callback, target);
    }

    targetOff (target: any) {
        target = target || this;
        this.dispatcher.targetOff(target);
    }
}

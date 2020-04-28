
/*
帮助类
*/

const {ccclass, property} = cc._decorator;

@ccclass
export default class YAUtils {

    /**
     * 深度拷贝
     * @param object 要拷贝的数据
     */
    static clone (object: any) {
        if (!object || typeof (object) !== "object") {
            return object;
        }

        let Constructor = object.constructor;
        let ret = new Constructor();
        for (let attr in object) {
            if (object.hasOwnProperty(attr)) {
                let value = object[attr];
                if (value === object) {
                    return;
                }
                if (typeof (value) === "object") {
                    ret[attr] = this.clone(value);
                }
                else {
                    ret[attr] = value;
                }
            }
        }
        return ret;
    }

    /**
     * 添加点击事件
     * @param node 目标对象
     * @param efunc 响应回调
     */
    static addClickEvent (node: cc.Node, efunc: Function) {
        node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event) => {
            efunc && (efunc(event));
            event.stopPropagation();
        });
    }

    static addStartEvent (node: cc.Node, sfunc: Function) {
        node.on(cc.Node.EventType.TOUCH_START, (event: cc.Event) => {
            sfunc && (sfunc(event));
            event.stopPropagation();
        });
    }

    static addMoveEvent (node: cc.Node, mfunc: Function) {
        node.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event) => {
            mfunc && (mfunc(event));
            event.stopPropagation();
        });
    }

    static addCancelEvent (node: cc.Node, cfunc: Function) {
        node.on(cc.Node.EventType.TOUCH_CANCEL, (event: cc.Event) => {
            cfunc && (cfunc(event));
        });
    }

    static addTouchEvent (node: cc.Node, sfunc: Function|null, mfunc?: Function|null, efunc?: Function|null, cfunc?: Function|null) {
        sfunc && (this.addStartEvent(node, sfunc));
        mfunc && (this.addMoveEvent(node, mfunc));
        efunc && (this.addClickEvent(node, efunc));
        cfunc && (this.addCancelEvent(node, cfunc));
    }

    static doCallback (callback: any, params?: any) {
        if (typeof(callback) === "function") {
            callback(params);
        }
    }

    /**
     * IPhoneX 适配
     * @param nodeName 需要适配的节点
     */
    static adjustIPhoneX (node: cc.Node) {
        let widget = node.getComponent(cc.Widget);
        if (!widget) return;
        
        let winSize = cc.director.getWinSize();
        let safeRect = cc.sys.getSafeAreaRect();
        let offset = winSize.height - safeRect.height - safeRect.y;

        widget.top = offset;
        widget.updateAlignment();
    }

}

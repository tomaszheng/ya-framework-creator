
/*
帮助类
*/

class YaUtils {

    /**
     * 深度拷贝
     * @param object 要拷贝的数据
     */
    public static clone (object: any) {
        if (!object || typeof (object) !== "object") {
            return object;
        }

        const Constructor = object.constructor;
        const ret = new Constructor();
        for (const attr in object) {
            if (object.hasOwnProperty(attr)) {
                const value = object[attr];
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

    public static doCallback (callback?: (...args)=>void, args?: any) {
        if (callback) callback(args);
    }

    public static mixins(derivedCtor: any, baseCtorList: any[]) {
        baseCtorList.forEach(baseCtor => {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
                derivedCtor.prototype[name] = baseCtor.prototype[name];
            });
        });
    }

    /**
     * IPhoneX 适配
     * @param node 需要适配的节点
     */
    public static adjustIPhoneX (node: cc.Node) {
        const widget = node.getComponent(cc.Widget);
        if (!widget) return;

        const winSize = cc.director.getWinSize();
        const safeRect = cc.sys.getSafeAreaRect();

        widget.top = winSize.height - safeRect.height - safeRect.y;
        widget.updateAlignment();
    }
}

export {YaUtils};

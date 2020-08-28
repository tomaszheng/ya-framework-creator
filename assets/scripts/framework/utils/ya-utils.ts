/*
帮助类
*/

class YaUtils {
    public static doCallback(callback?: (...args) => void, args?: any) {
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
    public static adjustIPhoneX(node: cc.Node) {
        const widget = node.getComponent(cc.Widget);
        if (!widget) return;

        const winSize = cc.director.getWinSize();
        const safeRect = cc.sys.getSafeAreaRect();

        widget.top = winSize.height - safeRect.height - safeRect.y;
        widget.updateAlignment();
    }
}

const yaUtils = YaUtils;
export {yaUtils};

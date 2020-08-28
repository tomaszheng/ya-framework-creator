class YaButtonHelper {
    public static addClick(node: cc.Node, endCallback: (event: cc.Event) => void, target: cc.Component) {
        node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event) => {
            endCallback.call(target, event);
        }, target);
    }

    public static addStart(node: cc.Node, startCallback: (event: cc.Event) => void, target: cc.Component) {
        node.on(cc.Node.EventType.TOUCH_START, (event: cc.Event) => {
            startCallback.call(target, event);
        }, target);
    }

    public static addMove(node: cc.Node, moveCallback: (event: cc.Event) => void, target: cc.Component) {
        node.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event) => {
            moveCallback.call(target, event);
        }, target);
    }

    public static addCancel(node: cc.Node, cancelCallback: (event: cc.Event) => void, target: cc.Component) {
        node.on(cc.Node.EventType.TOUCH_CANCEL, (event: cc.Event) => {
            cancelCallback.call(target, event);
        }, target);
    }
}

const yaButtonHelper = YaButtonHelper;
export {yaButtonHelper};

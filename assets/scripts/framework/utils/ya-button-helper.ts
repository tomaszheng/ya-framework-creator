class YaButtonHelper {
    public static addClick(node: cc.Node, endCallback: (event: cc.Event) => void) {
        node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event) => {
            endCallback(event);
            event.stopPropagation();
        });
    }

    public static addStart(node: cc.Node, startCallback: (event: cc.Event) => void) {
        node.on(cc.Node.EventType.TOUCH_START, (event: cc.Event) => {
            startCallback(event);
            event.stopPropagation();
        });
    }

    public static addMove(node: cc.Node, moveCallback: (event: cc.Event) => void) {
        node.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event) => {
            moveCallback(event);
            event.stopPropagation();
        });
    }

    public static addCancel(node: cc.Node, cancelCallback: (event: cc.Event) => void) {
        node.on(cc.Node.EventType.TOUCH_CANCEL, (event: cc.Event) => {
            cancelCallback(event);
        });
    }
}

const yaButtonHelper = YaButtonHelper;
export {yaButtonHelper};

/*
视图的基础类
*/

import {YaBaseComponent} from "../base/ya-base-component";

const {ccclass} = cc._decorator;

@ccclass
class YaView extends YaBaseComponent {
    protected initUI() {
        super.initUI();

        const widget: cc.Widget = this.node.addComponent(cc.Widget);
        widget.alignMode = cc.Widget.AlignMode.ON_WINDOW_RESIZE;
        widget.top = widget.bottom = widget.left = widget.right = 0;
    }
}

export {YaView};
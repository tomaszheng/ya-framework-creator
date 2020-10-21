/*
视图的基础类
*/

import {BaseComponent} from "../base/BaseComponent";
import {BaseModel} from "./BaseModel";

const {ccclass} = cc._decorator;

@ccclass
class BaseView extends BaseComponent {
    /**
     * override
     * 数据模型
     */
    protected _model: BaseModel;

    public init(data?: any) {
        super.init(data);

        this.requestServer();
    }

    protected initUI() {
        super.initUI();

        let widget = this.node.getComponent(cc.Widget);
        if (!widget) {
            widget = this.node.addComponent(cc.Widget);
            widget.alignMode = cc.Widget.AlignMode.ON_WINDOW_RESIZE;
            widget.top = widget.bottom = widget.left = widget.right = 0;
        }
    }

    protected initModelEvent() {
        super.initModelEvent();

        if (this._model) {
            this._model.on(this._model.EVENT_SERVER_LOADED, this.handlerServerLoaded, this);
        }
    }

    /**
     * override
     * 请求此弹窗的数据
     */
    protected requestServer() {

    }

    protected handlerServerLoaded() {
        this.updateUI();
    }
}

export {BaseView};

/*
弹窗的基础类
弹窗打开逻辑遵循以下逻辑：
1，请求服务器数据；
2，执行打开动作；
在上述两步均完成后，才进行弹窗的处理逻辑
【注意1】弹窗是特殊的视图，因此继承于BaseView
*/

import {dialogManager} from "../../manager/DialogManager";
import {BaseView} from "../BaseView";
import {DialogScaleTransition, DialogTransition} from "./DialogTransition";

const {ccclass} = cc._decorator;

enum DialogShowTypes {
    NONE = 0,

    /**
     * 从中间缩放打开
     */
    SCALE,

    /**
     * 从指定位置缩放打开
     */
    POSITION_SCALE,

    /**
     * 从指定位置移动
     */
    POSITION_MOVE,

    /**
     * 自定义
     */
    CUSTOM,
}

const DialogCharacter = {
    NONE: 0,

    /**
     * 常驻，一直显示
     */
    RESIDENT: 1,

    /**
     * 唯一性，此类型的弹窗同时只能存在一个
     */
    UNIQUE: 2,

    /**
     * 置顶
     */
    TOP: 4,
};

@ccclass
class BaseDialog extends BaseView {
    public set id(id) {
        this._id = id;
    }

    public get id() {
        return this._id;
    }

    public set showType(type) {
        this._showType = type;
    }

    public get showType() {
        return this._showType;
    }

    public set character(c) {
        this._character = c;
    }

    public get character() {
        return this._character;
    }

    public set dataLoaded(loaded) {
        this._isDataLoaded = loaded;
    }

    private _isDataLoaded = false;
    private _isEnterCompleted = false;
    private _isExitCompleted = false;
    private _oldOriginalPosition = cc.v3();
    private _transition: DialogTransition = null;

    protected _id = -1;
    protected _showType = DialogShowTypes.NONE;
    protected _character = DialogCharacter.NONE;

    protected initUI() {
        super.initUI();

        this.initTransition();
    }

    protected initTransition() {
        this._transition = this.node.addComponent(DialogScaleTransition) as DialogTransition;
        this._transition.init(this.onEnterCompleted.bind(this), this.onExitCompleted.bind(this));
    }

    protected initTouchEvent() {
        super.initTouchEvent();

        this.node.on(cc.Node.EventType.TOUCH_START, () => {}, this, true);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onClickSpace.bind(this), this);
    }

    /**
     * 触摸到了空白区域，默认关闭弹窗
     */
    protected onClickSpace() {
        if (this._isEnterCompleted) {
            this.removeSelf();
        }
    }

    protected handlerDataLoaded() {
        this._isDataLoaded = true;
        if (this._isEnterCompleted) {
            this.updateUI();
        }
    }

    public show() {
        this._oldOriginalPosition = this.node.position;

        if (this._transition) {
            this._transition.runEnter();
        } else {
            this.node.active = true;
            this.onEnterCompleted();
        }
    }

    public display() {
        this.setNormalStatus();
        this.node.active = true;
        this.node.position = this._oldOriginalPosition;
    }

    private setNormalStatus() {
        this.node.scale = 1.0;
        this.node.opacity = 255;
    }

    protected onEnterCompleted() {
        this._isEnterCompleted = true;
        if (this._isDataLoaded) {
            this.updateUI();
        }
    }

    public close() {
        if (this._transition) {
            this._transition.runExit();
        } else {
            this.onExitCompleted();
        }
    }

    public hide() {
        this.setNormalStatus();

        if (this._transition) {
            this._transition.stop();
            this.onEnterCompleted();
        }

        this.node.active = false;
    }

    protected onExitCompleted() {
        this._isExitCompleted = true;

        this.node.active = false;
        this.removeSelf();
    }

    public removeSelf() {
        dialogManager.remove(this.id);
    }

    protected onDestroy() {
        super.onDestroy();
    }
}

export {BaseDialog, DialogShowTypes, DialogCharacter};

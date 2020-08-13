/*
弹窗的基础类
弹窗打开逻辑遵循以下逻辑：
1，请求服务器数据；
2，执行打开动作；
在上述两步均完成后，才进行弹窗的处理逻辑
【注意1】弹窗是特殊的视图，因此继承于YaView
*/

import {yaDialogManager} from "../manager/ya-dialog-manager";
import {YaView} from "./ya-view";

const {ccclass} = cc._decorator;

enum YaDialogShowTypes {
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

const YaDialogCharacter = {
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
class YaDialog extends YaView {
    public set id(i) {
        this._id = i;
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
    private _actionEnter: cc.Tween<any>;

    protected _id = -1;
    protected _showType = YaDialogShowTypes.NONE;
    protected _character = YaDialogCharacter.NONE;

    protected initTouchEvent() {
        super.initTouchEvent();

        this.node.on(cc.Node.EventType.TOUCH_START, () => {
        }, this, true);
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.onClickSpace();
        }, this);
    }

    /**
     * 触摸到了空白区域，默认关闭弹窗
     */
    protected onClickSpace() {
        if (this._isEnterCompleted) {
            this.removeSelf();
        }
    }

    protected handlerServerLoaded() {
        this._isDataLoaded = true;
        if (this._isEnterCompleted) {
            this.updateUI();
        }
    }

    private setNormalStatus() {
        this.node.scale = 1.0;
        this.node.opacity = 0;
    }

    public show() {
        this._oldOriginalPosition = this.node.position;

        switch (this._showType) {
            case YaDialogShowTypes.NONE: {
                this.node.active = true;
                this.onEnterCompleted();
                break;
            }
            case YaDialogShowTypes.SCALE: {
                this.runEnterScaleAction(() => {
                    this.onEnterCompleted();
                });
                break;
            }
            case YaDialogShowTypes.CUSTOM: {
                this.runEnterCustomAction(() => {
                    this.onEnterCompleted();
                });
                break;
            }
        }
    }

    public display() {
        this.setNormalStatus();

        this.node.active = true;
        this.node.scale = 1.0;
        this.node.position = this._oldOriginalPosition;
    }

    public close() {
        switch (this._showType) {
            case YaDialogShowTypes.SCALE: {
                this.runExitScaleAction(() => {
                    this.onExitCompleted();
                });
                break;
            }
            default: {
                this.onExitCompleted();
            }
        }
    }

    public hide() {
        this.setNormalStatus();

        if (this._actionEnter) {
            this._actionEnter.stop();
            this._actionEnter = null;

            this.onEnterCompleted();
        }

        this.node.active = false;
    }

    protected onEnterCompleted() {
        this._isEnterCompleted = true;

        if (this._isDataLoaded) {
            this.updateUI();
        }
    }

    protected onExitCompleted() {
        this._isExitCompleted = true;

        this.node.active = false;
        this.removeSelf();
    }

    public removeSelf() {
        yaDialogManager.remove(this.id);
    }

    private runEnterScaleAction(callback: () => void) {
        this.node.scale = 0.6;
        this.node.anchorX = this.node.anchorY = 0.5;

        this._actionEnter = cc.tween(this.node)
            .to(0.2, {scale: 1.08}, {easing: "sineOut"})
            .to(0.2, {scale: 1.00}, {easing: "sineOut"})
            .delay(0.0)
            .call(() => {
                this._actionEnter = null;
                if (callback) callback();
            });
    }

    /**
     * override
     * 执行定制的进入动作
     */
    protected runEnterCustomAction(callback: () => void) {
        if (callback) callback();
    }

    private runExitScaleAction(callback: () => void) {
        cc.tween(this.node)
            .parallel(
                cc.tween().to(0.1, {scale: 0.8}),
                cc.tween().to(0.1, {opacity: 130})
            )
            .call(() => {
                if (callback) callback();
            });
    }

    protected onDestroy() {
        super.onDestroy();
    }
}

export {YaDialog, YaDialogShowTypes, YaDialogCharacter};

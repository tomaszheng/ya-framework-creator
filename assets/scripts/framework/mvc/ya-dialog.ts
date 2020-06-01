
/*
弹窗的基础类
*/

import YADialogProperty from "./ya-dialog-property";
import YADialogManager from "../manager/ya-dialog-manager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class YADialog extends cc.Component {
    _data = {};
    /**
     * 打开弹窗时，传入的初始数据
     */
    set data (data: any) {
        this._data = data;
    }
    get data () {
        return this._data;
    }

    _property: YADialogProperty = null;
    /**
     * 弹窗的属性
     */
    set params (property: YADialogProperty) {
        this._property = property;
    }
    get params (): YADialogProperty {
        return this._property;
    }

    initted: boolean = false;
    isDataLoadded: boolean = false;

    isEnterCompleted: boolean = false;
    isExitCompleted: boolean = false;

    normalPosition: cc.Vec3 = cc.v3();

    actionEnter = null;

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START, () => { }, this, true);
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.onClickSpace();
        }, this);
    }
    
    swallowTouch (node: cc.Node) {
        node.on(cc.Node.EventType.TOUCH_START, () => { }, this, true);
    }

    init (params: YADialogProperty, data: any) {
        this.params = params;
        this.data = data;

        this.onInitData(data);

        this.onInitUI();

        this.onInitEvent();

        this.onInitClick();

        this.initted = true;

        this.onRequestServer();
    }

    /**
     * override
     * 初始化数据
     * @param data 
     */
    onInitData (data: any) {
        
    }

    /**
     * override
     * 初始化UI，对UI进行初始化操作
     */
    onInitUI () {

    }

    /**
     * override
     * 初始化数据发生变化时的监听
     */
    onInitEvent () {

    }

    /**
     * override
     * 初始化按钮点击事件
     */
    onInitClick() {

    }

    /**
     * 触摸到了空白区域，默认关闭弹窗
     */
    onClickSpace () {
        if (this.isEnterCompleted) {
            this.removeSelf();
        }
    }

    private setNormalStatus () {
        this.node.scale = 1.0;
        this.node.opacity = 0;
    }

    /**
     * override
     * 请求此弹窗的数据
     */
    onRequestServer () {

    }

    /**
     * 请求数据回报后，调用此方法
     */
    updateUI () {
        this.isDataLoadded = true;

        if (this.isEnterCompleted) {
            this.onUpdateUI();
        }
    }

    /**
     * override
     * 弹窗所需要的数据已经全部拿到并且弹窗进入动作已经完成，可以对UI进行更新
     */
    onUpdateUI () {

    }

    /**
     * 打开弹窗
     */
    show () {
        this.normalPosition = this.node.position;

        if (this.params.showType === YADialogProperty.ShowTypes.NO) { // 直接打开
            this.node.active = true;
            this.onEnterCompleted();
        }
        else if (this.params.showType === YADialogProperty.ShowTypes.SCALE) { // 缩放打开
            this.runEnterScaleAction(() => {
                this.onEnterCompleted();
            })
        }
        else if (this.params.showType === YADialogProperty.ShowTypes.CUSTOM) { // 自定义进入动作
            this.runEnterCustomAction(() => {
                this.onEnterCompleted();
            });
        }
    }

    /**
     * 直接展示弹窗
     */
    display () {
        this.setNormalStatus();

        this.node.active = true;
        this.node.position = this.normalPosition;
    }

    /**
     * 关闭弹窗
     */
    close () {
        // 缩放打开时也缩放关闭
        if (this.params.showType === YADialogProperty.ShowTypes.SCALE) {
            this.runExitScaleAction(() => {
                this.onExitCompleted();
            })
        }
        else {
            this.onExitCompleted();
        }
    }

    /**
     * 直接隐藏弹窗
     */
    hide () {
        this.setNormalStatus();

        if (this.actionEnter) {
            this.actionEnter.stop();
            this.actionEnter = null;

            this.onEnterCompleted();
        }
        
        this.node.active = false;
    }

    onEnterCompleted() {
        this.isEnterCompleted = true;

        if (this.isDataLoadded) {
            this.onUpdateUI();
        }
    }

    removeSelf() {
        let did = this.params.did;
        YADialogManager.getInstance().remove(did);
    }

    /**
     * 弹窗关闭完成时回调
     */
    onExitCompleted () {
        this.isExitCompleted = true;

        this.node.active = false;

        this.removeSelf();
    }

    /**
     * 执行缩放打开的进入动作
     * @param callback 完成回调
     */
    runEnterScaleAction (callback: Function) {
        this.node.scale = 0.6;
        this.node.anchorX = this.node.anchorY = 0.5;

        this.actionEnter = cc.tween(this.node)
            .to(0.2, {scale: 1.08}, {easing: "sineOut"})
            .to(0.2, {scale: 1.00}, {easing: "sineOut"})
            .delay(0.0)
            .call(() => {
                this.actionEnter = null;
                callback && callback();
            });
    }

    /**
     * override
     * 执行定制的进入动作
     */
    runEnterCustomAction (callback: Function) {
        callback && callback();
    }

    /**
     * 执行缩放退出动作
     * @param callback 
     */
    runExitScaleAction (callback: Function) {
        cc.tween(this.node)
            .parallel(
                cc.tween().to(0.1, {scale: 0.8}),
                cc.tween().to(0.1, {opacity: 130})
            )
            .call(() => {
                callback && callback();
            });
    }
    
    onDestroy() {

    }
}
/*
通用控制器
任何通用的、全局性的东西都可以放到这里
*/

import {ya} from "../../framework/ya";
import {EventConfig} from "../../config/EventConfig";
import {CommonView} from "./CommonView";

class CommonController extends ya.Controller {
    protected _view: CommonView;
    public get view(): CommonView {
        return this._view;
    }

    public get viewName() {
        return 'CommonView';
    }

    public get root () {
        return ya.layerManager.top;
    }

    initGlobalListener() {
        cc.game.on(cc.game.EVENT_SHOW, this.onShow, this);
        cc.game.on(cc.game.EVENT_HIDE, this.onHide, this);

        ya.eventDispatcher.add(EventConfig.SHOW_TOAST,       this.onShowToast, this);        // 显示toast
        ya.eventDispatcher.add(EventConfig.SHOW_WAITING,     this.onShowWaiting, this);     // 显示等待界面
        ya.eventDispatcher.add(EventConfig.REMOVE_WAITTING,  this.onRemoveWaiting, this);   // 移除等待界面
    }

    onShow (params: any) {

    }

    onHide () {

    }

    onShowWaiting () {

    }

    onRemoveWaiting () {

    }

    onShowToast (params: any) {
        this.view.showToast(params);
    }
}

export {CommonController};
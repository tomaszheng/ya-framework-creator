/*
通用控制器
任何通用的、全局性的东西都可以放到这里
*/

import {EventConfig} from "../../config/EventConfig";
import {CommonView} from "./CommonView";
import {BaseController} from "../../framework/mvc/BaseController";
import {layerManager} from "../../framework/manager/LayerManager";
import {eventDispatcher} from "../../framework/event/EventDispatcher";

class CommonController extends BaseController {
    public get view(): CommonView {
        return this._view as CommonView;
    }

    public get viewClassname() {
        return 'CommonView';
    }

    public get root () {
        return layerManager.top;
    }

    protected initGlobalListener() {
        cc.game.on(cc.game.EVENT_SHOW, this.onShow, this);
        cc.game.on(cc.game.EVENT_HIDE, this.onHide, this);

        eventDispatcher.on(EventConfig.SHOW_TOAST,       this.onShowToast,     this);  // 显示toast
        eventDispatcher.on(EventConfig.SHOW_WAITING,     this.onShowWaiting,   this);  // 显示等待界面
        eventDispatcher.on(EventConfig.REMOVE_WAITING,   this.onRemoveWaiting, this);  // 移除等待界面
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

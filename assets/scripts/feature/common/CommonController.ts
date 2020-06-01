/*
全局控制器
任何全局性的东西都可以放到这里
*/

import ya from "../../framework/ya"
import EventConfig from "../../config/EventConfig";

export default class CommonController extends ya.Controller {
    get root () {
        return ya.layer.top;
    }

    get component (): string {
        return "CommonView";
    }

    initGlobalListener() {
        ya.eventDispatcher.on(EventConfig.ON_SHOW, this.onShow, this); // 监听切前台
        ya.eventDispatcher.on(EventConfig.ON_HIDE, this.onHide, this); // 监听切后台

        ya.eventDispatcher.on(EventConfig.SHOW_TOAST,       this.onShowToast, this);        // 显示toast
        ya.eventDispatcher.on(EventConfig.SHOW_WAITING,     this.onShowWaitting, this);     // 显示等待界面
        ya.eventDispatcher.on(EventConfig.REMOVE_WAITTING,  this.onRemoveWaitting, this);   // 移除等待界面
    }

    onShow (params: any) {

    }

    onHide () {

    }

    onShowWaitting () {

    }

    onRemoveWaitting () {

    }

    onShowToast (params: any) {
        this.view.showToast(params);
    }
}

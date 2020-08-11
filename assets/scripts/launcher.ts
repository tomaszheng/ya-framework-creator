
/*
启动器
主场景被加载后，用来对游戏的初始化
*/

// import BasicPlatform from "./Platform/BasicPlatform";
// import WeChatPlatform from "./Platform/WeChatPlatform";
import ControllerManager from "./manager/ControllerManager";
import { ModelManager } from "./manager/ModelManager";
import {ya} from "./framework/ya";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Launcher extends cc.Component {
    @property(cc.Node)
    layerView:cc.Node = null;

    @property(cc.Node)
    layerDialog:cc.Node = null;

    @property(cc.Node)
    layerTop:cc.Node = null;

    start () {
        ya.layer.top = this.layerTop;       // 最顶层
        ya.layer.dialog = this.layerDialog; // 弹窗层
        ya.layer.view = this.layerView;     // 场景层

        ya.init();
        ControllerManager.getInstance().init();

        ModelManager.instance.init();

        this.launch();
    }

    launch () {
        ya.viewManager.show("common");

        ya.viewManager.show("loading");
    }
}
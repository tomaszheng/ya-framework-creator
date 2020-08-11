
/*
启动器
主场景被加载后，用来对游戏的初始化
*/

// import BasicPlatform from "./Platform/BasicPlatform";
// import WeChatPlatform from "./Platform/WeChatPlatform";
import {ya} from "./framework/ya";
import {modelManager} from "./manager/ModelManager";
import {controllerManager} from "./manager/ControllerManager";

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
        ya.init();

        modelManager.init();

        controllerManager.init();

        this.launch();
    }

    launch () {
        ya.viewManager.show("common");

        ya.viewManager.show("loading");
    }
}
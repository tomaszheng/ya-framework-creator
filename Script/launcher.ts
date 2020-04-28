
/*
启动器
主场景被加载后，用来对游戏的初始化
*/

// import BasicPlatform from "./Platform/YABasicPlatform";
// import WeChatPlatform from "./Platform/YAWeChatPlatform";
import ya from "./Framework/ya";


const {ccclass, property} = cc._decorator;

@ccclass
export default class launcher extends cc.Component {
    @property(cc.Node)
    layerView:cc.Node = null;

    @property(cc.Node)
    layerDialog:cc.Node = null;

    @property(cc.Node)
    layerTop:cc.Node = null;

    start () {
        ya.getInstance();

        ya.layer.top = this.layerTop;       // 最顶层
        ya.layer.dialog = this.layerDialog; // 弹窗层
        ya.layer.view = this.layerView;     // 场景层

        this.launch();
    }

    launch() {
        // ya.viewManager.get("global").show();

        // ya.viewManager.show("loading");
    }
}
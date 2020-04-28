
/*
加载界面
*/

import ya from "../../Framework/ya";
import ResourceConfig from "../../Config/res/ResourceConfig";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LoadingView extends ya.View {
    onInitUI () {
        ya.resourceManager.load(ResourceConfig.main, () => {
            ya.viewManager.show("main");

            ya.soundManager.playMusic("bgm");
        });
    }
}
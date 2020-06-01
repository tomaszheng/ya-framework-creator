
/*
加载界面
*/

import ya from "../../framework/ya";
import ResourceConfig from "../../config/resource/ResourceConfig";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LoadingView extends ya.View {
    onInitUI () {
        console.error("==---loading");
        ya.resourceManager.load(ResourceConfig.main, () => {
            ya.viewManager.show("main");

            ya.soundManager.playMusic("bgm");
        });
    }
}
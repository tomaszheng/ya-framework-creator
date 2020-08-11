
/*
加载界面
*/

import {ya} from "../../framework/ya";
import ResourceConfig from "../../config/resource/ResourceConfig";

const {ccclass} = cc._decorator;

@ccclass
class LoadingView extends ya.View {
    protected initUI() {
        super.initUI();

        ya.resourceManager.load(ResourceConfig.main, () => {
            ya.viewManager.show("main");

            ya.soundManager.playMusic("bgm");
        });
    }
}

export {LoadingView};
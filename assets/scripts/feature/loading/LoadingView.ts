
/*
加载界面
*/

import {ya} from "../../framework/ya";

const {ccclass} = cc._decorator;

@ccclass
class LoadingView extends ya.View {
    protected initUI() {
        super.initUI();

        ya.viewManager.show("main");

        ya.soundManager.playMusic("bgm");
    }
}

export {LoadingView};

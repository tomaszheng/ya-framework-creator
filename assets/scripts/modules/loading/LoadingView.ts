import {BaseView} from "../../framework/mvc/BaseView";
import {soundManager} from "../../framework/manager/SoundManager";
import {viewManager} from "../../framework/manager/ViewManager";

const {ccclass} = cc._decorator;

@ccclass
class LoadingView extends BaseView {
    protected initUI() {
        super.initUI();

        viewManager.show('main');
        soundManager.playMusic('common/sounds/bgm');
    }
}

export {LoadingView};

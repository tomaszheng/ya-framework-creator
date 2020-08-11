import {ya} from "../../framework/ya";
import {GameText} from "../../config/GameText";

const {ccclass, property} = cc._decorator;

@ccclass
class PauseView extends ya.Dialog {
    @property(cc.Label) lblSound: cc.Label = null;
    @property(cc.Node) btnClose: cc.Node = null;
    @property(cc.Node) btnContinue: cc.Node = null;
    @property(cc.Node) btnRestart: cc.Node = null;
    @property(cc.Node) btnMain: cc.Node = null;
    @property(cc.Node) btnSound: cc.Node = null;

    continueCb: ()=>void = null;
    restartCb: ()=>void = null;
    mainCb: ()=>void = null;

    protected initData(data?: any) {
        super.initData(data);

        this.continueCb = data.continue_cb;
        this.restartCb = data.restart_cb;
        this.mainCb = data.main_cb;
    }

    protected initUI() {
        super.initUI();

        const enabled = ya.localStorage.getBool(ya.StorageConfig.EFFECT_ENABLED, true);
        this.lblSound.string = enabled ? GameText.str_005 : GameText.str_006;
    }

    protected initTouchEvent() {
        super.initTouchEvent();

        ya.button.addClick(this.btnClose, ()=>{
            this.onClickClose();
        });

        ya.button.addClick(this.btnContinue, ()=>{
            this.onClickContinue();
        });

        ya.button.addClick(this.btnRestart, ()=>{
            this.onClickRestart();
        });

        ya.button.addClick(this.btnMain, ()=>{
            this.onClickMain();
        });

        ya.button.addClick(this.btnSound, ()=>{
            this.onClickSound();
        });
    }

    onClickClose () {
        this.removeSelf();

        ya.utils.doCallback(this.continueCb);
    }

    onClickSpace () {
        this.onClickClose();
    }

    onClickContinue () {
        this.removeSelf();

        ya.utils.doCallback(this.continueCb);
    }

    onClickRestart () {
        this.removeSelf();

        ya.utils.doCallback(this.restartCb);
    }

    onClickMain () {
        this.removeSelf();

        ya.utils.doCallback(this.mainCb);

        ya.viewManager.show("main", null, true);
    }

    onClickSound () {
        const enabled = !ya.localStorage.getBool(ya.StorageConfig.EFFECT_ENABLED, true);
        this.lblSound.string = enabled ? GameText.str_005 : GameText.str_006;
        ya.soundManager.effect = enabled;
    }
}

export {PauseView};
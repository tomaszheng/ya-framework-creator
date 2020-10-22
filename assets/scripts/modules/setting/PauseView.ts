import {ya} from "../../framework/ya";
import {GameText} from "../../config/GameText";
import {BaseDialog} from "../../framework/mvc/dialog/BaseDialog";
import {storageManager} from "../../framework/manager/StorageManager";
import {buttonHelper} from "../../framework/utils/ButtonHelper";
import {soundManager, SoundManager} from "../../framework/manager/SoundManager";
import {utils} from "../../framework/utils/Utils";
import {viewManager} from "../../framework/manager/ViewManager";

const {ccclass, property} = cc._decorator;

@ccclass
class PauseView extends BaseDialog {
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

        const enabled = storageManager.getBool(SoundManager.EFFECT_ENABLED, true);
        this.lblSound.string = enabled ? GameText.str_005 : GameText.str_006;
    }

    protected initTouchEvent() {
        super.initTouchEvent();

        buttonHelper.addClick(this.btnClose, ()=>{
            this.onClickClose();
        }, this);

        buttonHelper.addClick(this.btnContinue, ()=>{
            this.onClickContinue();
        }, this);

        buttonHelper.addClick(this.btnRestart, ()=>{
            this.onClickRestart();
        }, this);

        buttonHelper.addClick(this.btnMain, ()=>{
            this.onClickMain();
        }, this);

        buttonHelper.addClick(this.btnSound, ()=>{
            this.onClickSound();
        }, this);
    }

    onClickClose () {
        this.removeSelf();

        utils.doCallback(this.continueCb);
    }

    onClickSpace () {
        this.onClickClose();
    }

    onClickContinue () {
        this.removeSelf();

        utils.doCallback(this.continueCb);
    }

    onClickRestart () {
        this.removeSelf();

        utils.doCallback(this.restartCb);
    }

    onClickMain () {
        this.removeSelf();

        utils.doCallback(this.mainCb);

        viewManager.show("main", null, true);
    }

    onClickSound () {
        const enabled = !storageManager.getBool(SoundManager.EFFECT_ENABLED, true);
        this.lblSound.string = enabled ? GameText.str_005 : GameText.str_006;
        soundManager.effect = enabled;
    }
}

export {PauseView};

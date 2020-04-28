import ya from "../../Framework/ya";
import GameText from "../../Config/GameText";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PauseView extends ya.Dialog {
    @property(cc.Label)
    lbl_sound: cc.Label = null;
    
    @property(cc.Node)
    btn_close: cc.Node = null;

    @property(cc.Node)
    btn_continue: cc.Node = null;

    @property(cc.Node)
    btn_restart: cc.Node = null;

    @property(cc.Node)
    btn_main: cc.Node = null;

    @property(cc.Node)
    btn_sound: cc.Node = null;

    continue_cb: Function = null;
    restart_cb: Function = null;
    main_cb: Function = null;

    onInitData (data: any) {
        this.continue_cb = data.continue_cb;
        this.restart_cb = data.restart_cb;
        this.main_cb = data.main_cb;
    }

    onInitUI () {
        let enabled = ya.localStorage.bool(ya.StorageConfig.EFFECT_ENABLED, true);
        this.lbl_sound.string = enabled ? GameText.str_005 : GameText.str_006;
    }

    onInitClick () {
        ya.utils.addClickEvent(this.btn_close, ()=>{
            this.onClickClose();
        });

        ya.utils.addClickEvent(this.btn_continue, ()=>{
            this.onClickContinue();
        });

        ya.utils.addClickEvent(this.btn_restart, ()=>{
            this.onClickRestart();
        });

        ya.utils.addClickEvent(this.btn_main, ()=>{
            this.onClickMain();
        });

        ya.utils.addClickEvent(this.btn_sound, ()=>{
            this.onClickSound();
        });
    }

    onClickClose () {
        this.removeSelf();

        this.continue_cb && this.continue_cb();
    }

    onClickSpace () {
        this.onClickClose();
    }

    onClickContinue () {
        this.removeSelf();

        this.continue_cb && this.continue_cb();
    }

    onClickRestart () {
        this.removeSelf();

        this.restart_cb && this.restart_cb();
    }

    onClickMain () {
        this.removeSelf();

        this.main_cb && this.main_cb();

        ya.viewManager.show("main", null, true);
    }

    onClickSound () {
        let enabled = !ya.localStorage.bool(ya.StorageConfig.EFFECT_ENABLED, true);
        this.lbl_sound.string = enabled ? GameText.str_005 : GameText.str_006;
        ya.soundManager.effect = enabled;
    }
}

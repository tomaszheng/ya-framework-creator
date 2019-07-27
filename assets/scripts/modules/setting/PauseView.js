
let Dialog = require("../../components/mvc/Dialog");

cc.Class({
    extends: Dialog,

    properties: {
        
        lbl_sound: cc.Label,

        btn_close: cc.Node,
        btn_continue: cc.Node,
        btn_restart: cc.Node,
        btn_main: cc.Node,
        btn_sound: cc.Node,

    },

    initData(params) {
        this._super(params);

        let d = this.init_data;
        this.continue_cb = d.continue_cb;
        this.restart_cb = d.restart_cb;
        this.main_cb = d.main_cb;
        
    },

    initUI() {

        let enabled = ya.storage.bool(ya.skey.EFFECT_ENABLED, true);
        this.lbl_sound.string = enabled ? ya.txt.str_005 : ya.txt.str_006;
    },

    initClick() {
        ya.utils.addClickEvent(this.btn_close, ()=>{
            this.onClickClose();
        })
        ya.utils.addClickEvent(this.btn_continue, ()=>{
            this.onClickContinue();
        })
        ya.utils.addClickEvent(this.btn_restart, ()=>{
            this.onClickRestart();
        })
        ya.utils.addClickEvent(this.btn_main, ()=>{
            this.onClickMain();
        })
        ya.utils.addClickEvent(this.btn_sound, ()=>{
            this.onClickSound();
        })
    },

    onClickClose() {
        this.removeSelf();

        this.continue_cb && this.continue_cb();
    },

    onClickSpace() {
        this.onClickClose();
    },

    onClickContinue() {
        this.removeSelf();

        this.continue_cb && this.continue_cb();
    },

    onClickRestart() {
        this.removeSelf();

        this.restart_cb && this.restart_cb();
    },

    onClickMain() {
        this.removeSelf();

        this.main_cb && this.main_cb();

        ya.mm.show("main", null, true);
    },

    onClickSound() {
        let enabled = !ya.storage.bool(ya.skey.EFFECT_ENABLED, true);
        this.lbl_sound.string = enabled ? ya.txt.str_005 : ya.txt.str_006;
        ya.music.effect = enabled;
    }

});


let Dialog = require("../../../components/mvc/Dialog");

cc.Class({
    extends: Dialog,

    properties: {
        btn_close: cc.Node,
        btn_continue: cc.Node,
        btn_restart: cc.Node,
    },

    initData(params) {
        this._super(params);

        let d = this.init_data;
        this.continue_cb = d.continue_cb;
        this.restart_cb = d.restart_cb;
    },

    initUI() {

    },

    initClick() {
        ya.utils.addClickEvent(this.btn_close, ()=>{
            this.onClickClose();
        });
        ya.utils.addClickEvent(this.btn_continue, ()=>{
            this.onClickContinue();
        });
        ya.utils.addClickEvent(this.btn_restart, ()=>{
            this.onClickRestart();
        });
    },

    onClickClose() {
        this.removeSelf();
    },
    onClickContinue() {
        this.removeSelf();

        this.continue_cb && this.continue_cb();
    },
    onClickRestart() {
        this.removeSelf();

        this.restart_cb && this.restart_cb();
    },
});
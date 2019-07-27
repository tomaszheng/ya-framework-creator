/*
toast管理器
*/

let Controller = require("../../components/mvc/Controller");

cc.Class({
    extends: Controller,

    properties: {

    },

    initGlobalEvent() {
        ya.event.on(ya.ekey.SHOW_TOAST, this.onShowToast, this);
    },

    onShowToast(params) {
        if (!this.view) return;

        this.view.addToast(params);
    }
});
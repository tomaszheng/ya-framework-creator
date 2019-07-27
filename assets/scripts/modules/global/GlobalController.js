/*
全局控制器
任何全局性的东西都可以放到这里
*/

let Controller = require("../../components/mvc/Controller");

let GlobalView = require("./GlobalView");

cc.Class({
    extends: Controller,

    properties: {

        root: {
            override: true,
            get() {
                return ya.layer.top;
            }
        },
    },

    ctor() {

    },

    initView() {
        let node = new cc.Node();
        let script = node.addComponent(GlobalView);
        script.init();
        return script;
    },
    
    initGlobalEvent() {
        //前后台切换-切前台监听
        cc.game.on(cc.game.EVENT_SHOW, (params)=>{

        });

        //前后台切换-切后台监听
        cc.game.on(cc.game.EVENT_HIDE, ()=>{

        });

        //监听切前台
        ya.event.on(ya.ekey.ON_SHOW, this.onShow, this);
        //监听切后台
        ya.event.on(ya.ekey.ON_HIDE, this.onHide, this);

        //显示等待界面
        ya.event.on(ya.ekey.SHOW_WAITTING, this.onShowWaitting, this);
        //移除等待界面
        ya.event.on(ya.ekey.REMOVE_WAITTING, this.onRemoveWaitting, this);

        ya.event.on(ya.ekey.SHOW_TOAST, this.onShowToast, this);

    },

    onShow(params) {

    },
    onHide() {

    },

    onShowWaitting() {

    },

    onRemoveWaitting() {

    },

    onShowToast(params) {
        this.view.showToast(params);
    },
});
/*
加载界面控制器
*/

let Controller = require("../../components/mvc/Controller");

let LoadingView = require("./LoadingView");

cc.Class({
    extends: Controller,

    ctor() {

    },
    
    initView(params) {
        let node = new cc.Node();
        let script = node.addComponent(LoadingView);
        script.init(params);
        return script;
    },
});
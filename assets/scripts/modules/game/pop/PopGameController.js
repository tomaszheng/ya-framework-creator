
let Controller = require("../../../components/mvc/Controller");

cc.Class({

    extends: Controller,

    initView(params) {
        let prefab = cc.loader.getRes(ya.res.prefab_game_pop);
        let script = cc.instantiate(prefab).getComponent("PopGameView");
        script.init(params);
        return script;
    },

    initGlobalEvent() {

    },

    initModuleEvent() {

    },

});

let Controller = require("../../components/mvc/Controller");

cc.Class({
    extends: Controller,

    properties: {
        id_rank: -1,
    },

    ctor() {

    },

    initView(params) {
        let prefab = cc.loader.getRes(ya.res.prefab_rank);
        let script = cc.instantiate(prefab).getComponent("RankView");
        script.init(params);
        return script;
    },

});
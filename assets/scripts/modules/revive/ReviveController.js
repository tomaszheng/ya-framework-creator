
let Controller = require("../../components/mvc/Controller");

cc.Class({
    extends: Controller,

    properties: {
        id_revive: -1,
    },

    ctor() {

    },
    
    initGlobalEvent() {
        ya.event.on(ya.ekey.EVT_SHOW_REVIVE, this.onShowRevive, this);
    },

    onShowRevive(params) {
        ya.rm.checkLoad("revive", ()=>{
            this.id_revive = ya.dm.push({
                prefab: ya.res.prefab_revive, 
                script: "ReviveView", 
                init_data: params,
                loadded_data: true, show_type: 1
            });
            ya.dm.pop();
        });
    }
});
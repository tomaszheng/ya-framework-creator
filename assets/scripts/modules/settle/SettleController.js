
let Controller = require("../../components/mvc/Controller");

cc.Class({
    extends: Controller,

    properties: {
        id_settle: -1,
    },

    ctor() {

    },
    
    initGlobalEvent() {
        ya.event.on(ya.ekey.EVT_SHOW_SETTLE, this.onShowSettle, this);
    },

    onShowSettle(params) {
        ya.rm.checkLoad("settle", ()=>{
            this.id_settle = ya.dm.push({
                prefab: ya.res.prefab_settle, 
                script: "SettleView", 
                init_data: params,
                loadded_data: true, show_type: 1
            });
            ya.dm.pop();
        });
    }
});
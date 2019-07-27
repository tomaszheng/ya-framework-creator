
let Controller = require("../../components/mvc/Controller");

cc.Class({
    extends: Controller,

    properties: {
        is_pause: -1,
    },

    ctor() {

    },
    
    initGlobalEvent() {
        ya.event.on(ya.ekey.EVT_SHOW_PAUSE, this.onShowPause, this);
    },

    onShowPause(params) {
        ya.rm.checkLoad("pause", ()=>{
            this.id_revive = ya.dm.push({
                prefab: ya.res.prefab_pause, 
                script: "PauseView", 
                init_data: params,
                loadded_data: true, show_type: 1
            });
            ya.dm.pop();
        });
    }
});
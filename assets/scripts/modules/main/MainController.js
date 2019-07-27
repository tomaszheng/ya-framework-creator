
let Controller = require("../../components/mvc/Controller");

cc.Class({
    extends: Controller,

    ctor() {

    },

    initView(params) {
        let prefab = cc.loader.getRes(ya.res.prefab_main);
        let script = cc.instantiate(prefab).getComponent("MainView");
        script.init(params);

        return script;
    },

    initGlobalEvent() {
        ya.event.on(ya.ekey.EVT_SHOW_ARCHIVE, this.onShowArchive, this);
    },

    initModuleEvent() {

    },

    onShowArchive(params) {
        ya.rm.checkLoad("archive", ()=>{
            ya.dm.push({
                prefab: ya.res.prefab_archive, 
                script: "ArchiveView",
                init_data: params,
                loadded_data: true, show_type: 1
            });
            ya.dm.pop();
        });
    },
});

/*
加载界面
*/

let View = require("../../components/mvc/View");

cc.Class({
    extends: View,

    properties: {
        
    },

    initData() {
        ya.model.cfg.init();
    },

    initUI() {
        ya.rm.checkLoad("main", () => {
            ya.mm.show("main");

            setTimeout(()=>{
                ya.music.sineInMusic(ya.res.sound_bgm, true);
            }, 500);

        });
    },

});
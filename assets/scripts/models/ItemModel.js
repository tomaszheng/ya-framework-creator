
/*
道具
*/

let Model = require("../components/mvc/Model");

cc.Class({
    extends: Model,

    properties: {

    },

    ctor() {
        
        this.item_dye_num = ya.storage.int(ya.skey.ITEM_DYE_NUM, 0);
        this.item_mix_num = ya.storage.int(ya.skey.ITEM_MIX_NUM, 0);
        this.item_bomb_num = ya.storage.int(ya.skey.ITEM_BOMB_NUM, 0);

    },

    getItemNum(mode) {
        let num = 0;
        switch(mode) {
            case ya.const.ITEM_MODE.MIX:
                num = this.item_mix_num; break;
            case ya.const.ITEM_MODE.DYE:
                num = this.item_dye_num; break;
            case ya.const.ITEM_MODE.BOMB:
                num = this.item_bomb_num; break;
        }
        return num;
    },

    setItemNum(mode, n) {
        let skey = "";
        switch(mode) {
            case ya.const.ITEM_MODE.MIX:
                skey = ya.skey.ITEM_MIX_NUM;
                this.item_mix_num = n; break;
            case ya.const.ITEM_MODE.DYE:
                skey = ya.skey.ITEM_DYE_NUM;
                this.item_dye_num = n; break;
            case ya.const.ITEM_MODE.BOMB:
                skey = ya.skey.ITEM_BOMB_NUM;
                this.item_bomb_num = n; break;
        }

        if (skey !== "") {
            ya.storage.set(skey, n);
            this.emit(ya.ekey.MD_ITEM_NUM_CHANGE, {mode: mode, num: n});
        }

    },

    addItemNum(mode, n) {
        let m = 0;
        switch(mode) {
            case ya.const.ITEM_MODE.MIX:
                m = this.item_mix_num + n;
                break;
            case ya.const.ITEM_MODE.DYE:
                m = this.item_dye_num + n;
                break;
            case ya.const.ITEM_MODE.BOMB:
                m = this.item_bomb_num + n;
                break;
        }
        
        this.setItemNum(mode, m);
    }

});
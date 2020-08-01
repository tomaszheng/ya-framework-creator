
/*
道具
*/

import ya from "../framework/ya";
import {StorageConfig} from "../config/StorageConfig";
import {GameConstant} from "../config/GameConstant";
import {EventConfig} from "../config/EventConfig";

class ItemModel extends ya.Model {

    item_dye_num: number = 0;
    item_mix_num: number = 0;
    item_bomb_num: number = 0;

    constructor () {
        super();

        this.item_dye_num = ya.localStorage.int(StorageConfig.ITEM_DYE_NUM, 0);
        this.item_mix_num = ya.localStorage.int(StorageConfig.ITEM_MIX_NUM, 0);
        this.item_bomb_num = ya.localStorage.int(StorageConfig.ITEM_BOMB_NUM, 0);
    }

    getItemNum (mode: number): number {
        let num = 0;
        switch(mode) {
            case GameConstant.ITEM_MODE.MIX:
                num = this.item_mix_num; break;
            case GameConstant.ITEM_MODE.DYE:
                num = this.item_dye_num; break;
            case GameConstant.ITEM_MODE.BOMB:
                num = this.item_bomb_num; break;
        }
        return num;
    }

    setItemNum (mode: number, n: number) {
        let skey = "";
        switch(mode) {
            case GameConstant.ITEM_MODE.MIX:
                skey = StorageConfig.ITEM_MIX_NUM;
                this.item_mix_num = n; break;
            case GameConstant.ITEM_MODE.DYE:
                skey = StorageConfig.ITEM_DYE_NUM;
                this.item_dye_num = n; break;
            case GameConstant.ITEM_MODE.BOMB:
                skey = StorageConfig.ITEM_BOMB_NUM;
                this.item_bomb_num = n; break;
        }

        if (skey !== "") {
            ya.localStorage.set(skey, n);
            this.emit(EventConfig.MD_ITEM_NUM_CHANGE, {mode: mode, num: n});
        }
    }

    addItemNum (mode: number, n: number) {
        let m = 0;
        switch(mode) {
            case GameConstant.ITEM_MODE.MIX:
                m = this.item_mix_num + n;
                break;
            case GameConstant.ITEM_MODE.DYE:
                m = this.item_dye_num + n;
                break;
            case GameConstant.ITEM_MODE.BOMB:
                m = this.item_bomb_num + n;
                break;
        }
        
        this.setItemNum(mode, m);
    }
}

export { ItemModel }
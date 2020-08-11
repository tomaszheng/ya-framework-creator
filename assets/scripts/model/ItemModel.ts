
/*
道具
*/

import {ya} from "../framework/ya";
import {StorageConfig} from "../config/StorageConfig";
import {GameConstant} from "../config/GameConstant";
import {EventConfig} from "../config/EventConfig";

class ItemModel extends ya.Model {

    itemDyeNum = 0;
    itemMixNum = 0;
    itemBombNum = 0;

    constructor () {
        super();

        this.itemDyeNum = ya.localStorage.getInt(StorageConfig.ITEM_DYE_NUM, 0);
        this.itemMixNum = ya.localStorage.getInt(StorageConfig.ITEM_MIX_NUM, 0);
        this.itemBombNum = ya.localStorage.getInt(StorageConfig.ITEM_BOMB_NUM, 0);
    }

    getItemNum (mode: number): number {
        let num = 0;
        switch(mode) {
            case GameConstant.ITEM_MODE.MIX:
                num = this.itemMixNum; break;
            case GameConstant.ITEM_MODE.DYE:
                num = this.itemDyeNum; break;
            case GameConstant.ITEM_MODE.BOMB:
                num = this.itemBombNum; break;
        }
        return num;
    }

    setItemNum (mode: number, n: number) {
        let skey = "";
        switch(mode) {
            case GameConstant.ITEM_MODE.MIX:
                skey = StorageConfig.ITEM_MIX_NUM;
                this.itemMixNum = n; break;
            case GameConstant.ITEM_MODE.DYE:
                skey = StorageConfig.ITEM_DYE_NUM;
                this.itemDyeNum = n; break;
            case GameConstant.ITEM_MODE.BOMB:
                skey = StorageConfig.ITEM_BOMB_NUM;
                this.itemBombNum = n; break;
        }

        if (skey !== "") {
            ya.localStorage.setItem(skey, n);
            this.emit(EventConfig.MD_ITEM_NUM_CHANGE, {mode, num: n});
        }
    }

    addItemNum (mode: number, n: number) {
        let m = 0;
        switch(mode) {
            case GameConstant.ITEM_MODE.MIX:
                m = this.itemMixNum + n;
                break;
            case GameConstant.ITEM_MODE.DYE:
                m = this.itemDyeNum + n;
                break;
            case GameConstant.ITEM_MODE.BOMB:
                m = this.itemBombNum + n;
                break;
        }

        this.setItemNum(mode, m);
    }
}

export {ItemModel};
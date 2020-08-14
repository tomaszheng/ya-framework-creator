import {ya} from "../../framework/ya";
import {EventConfig} from "../../config/EventConfig";

class ItemController extends ya.Controller {
    initGlobalListener () {
        this.addGlobalListener(EventConfig.EVT_SHOW_ITEM, this.onShowItem, this);
    }

    onShowItem (data: any) {
        ya.dialogManager.show('Prefab/dialog_item', data, {
            showType: ya.DialogShowTypes.SCALE,
            dataLoaded: true,
        });
    }
}

export {ItemController};
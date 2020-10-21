import {EventConfig} from "../../config/EventConfig";
import {BaseController} from "../../framework/mvc/BaseController";
import {dialogManager} from "../../framework/manager/DialogManager";
import {DialogShowTypes} from "../../framework/mvc/BaseDialog";

class ItemController extends BaseController {
    initGlobalListener () {
        this.addGlobalListener(EventConfig.EVT_SHOW_ITEM, this.onShowItem, this);
    }

    onShowItem (data: any) {
        dialogManager.show('Prefab/dialog_item', data, {
            showType: DialogShowTypes.SCALE,
            dataLoaded: true,
        });
    }
}

export {ItemController};

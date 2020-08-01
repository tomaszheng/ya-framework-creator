import ya from "../../framework/ya";
import { EventConfig } from "../../config/EventConfig";

export default class ItemController extends ya.Controller {

    initGlobalListener () {
        this.addGlobalListener(EventConfig.EVT_SHOW_ITEM,   this.onShowItem,    this);
    }

    onShowItem (data: any) {
        ya.dialogManager.show(new ya.DialogProperty({
            prefab: "Prefab/dialog_item",
            script: "ItemView",
            dataLoadded: true,
            showType: ya.DialogProperty.ShowTypes.SCALE,
        }), data);
    }
}
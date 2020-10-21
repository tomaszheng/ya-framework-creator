import {EventConfig} from "../../config/EventConfig";
import {BaseController} from "../../framework/mvc/BaseController";
import {dialogManager} from "../../framework/manager/DialogManager";
import {DialogShowTypes} from "../../framework/mvc/BaseDialog";
import {resourceManager} from "../../framework/manager/ResourceManager";

class SettleController extends BaseController {
    protected initGlobalListener() {
        super.initGlobalListener();
        this.addGlobalListener(EventConfig.EVT_SHOW_SETTLE, this.onShowSettle, this);
    }

    onShowSettle (data: any) {
        const prefabPath = 'resources/prefab/dialog_settle';
        resourceManager.load(prefabPath, cc.Prefab).then(()=> {
            dialogManager.show(prefabPath, data, {
                showType: DialogShowTypes.SCALE,
                dataLoaded: true,
            });
        });
    }
}

export {SettleController};

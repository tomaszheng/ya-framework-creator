import {EventConfig} from "../../config/EventConfig";
import {BaseController} from "../../framework/mvc/BaseController";
import {dialogManager} from "../../framework/manager/DialogManager";
import {DialogShowTypes} from "../../framework/mvc/dialog/BaseDialog";
import {resourceManager} from "../../framework/manager/ResourceManager";

class ReviveController extends BaseController {
    protected initGlobalListener() {
        super.initGlobalListener();

        this.addGlobalListener(EventConfig.EVT_SHOW_REVIVE, this.onShowRevive, this);
    }

    onShowRevive (data: any) {
        const prefabPath = 'prefab/dialog_revive';
        resourceManager.load(prefabPath, cc.Prefab).then(()=>{
            dialogManager.show(prefabPath, data, {
                showType: DialogShowTypes.SCALE,
                dataLoaded: true,
            });
        });
    }
}

export {ReviveController};

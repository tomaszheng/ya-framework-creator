import ResourceConfig from "../../config/resource/ResourceConfig";
import {ya} from "../../framework/ya";
import {EventConfig} from "../../config/EventConfig";
import {ReviveView} from "./ReviveView";

class ReviveController extends ya.Controller {
    protected initGlobalListener() {
        super.initGlobalListener();

        this.addGlobalListener(EventConfig.EVT_SHOW_REVIVE, this.onShowRevive, this);
    }

    onShowRevive (data: any) {
        const prefabPath = 'prefab/dialog_revive';
        ya.resourceManager.load(prefabPath, cc.Prefab).then(()=>{
            ya.dialogManager.show(prefabPath, data, {
                showType: ya.DialogShowTypes.SCALE,
                dataLoaded: true,
            });
        });
    }
}

export {ReviveController};

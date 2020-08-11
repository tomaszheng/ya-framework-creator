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
        ya.resourceManager.load(ResourceConfig.revive, () => {
            ya.dialogManager.show('Prefab/dialog_revive', data, {
                showType: ya.DialogShowTypes.SCALE,
                dataLoaded: true,
            });
        });
    }
}

export {ReviveController};
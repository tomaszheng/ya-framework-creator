import {ya} from "../../framework/ya";
import {EventConfig} from "../../config/EventConfig";
import ResourceConfig from "../../config/resource/ResourceConfig";

class SettleController extends ya.Controller {
    protected initGlobalListener() {
        super.initGlobalListener();
        this.addGlobalListener(EventConfig.EVT_SHOW_SETTLE, this.onShowSettle, this);
    }

    onShowSettle (data: any) {
        ya.resourceManager.load(ResourceConfig.settle, () => {
            ya.dialogManager.show('Prefab/dialog_settle"', data, {
                showType: ya.DialogShowTypes.SCALE,
                dataLoaded: true,
            });
        });
    }
}

export {SettleController};
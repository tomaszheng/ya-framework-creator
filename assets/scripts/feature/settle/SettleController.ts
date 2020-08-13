import {ya} from "../../framework/ya";
import {EventConfig} from "../../config/EventConfig";
import ResourceConfig from "../../config/resource/ResourceConfig";

class SettleController extends ya.Controller {
    protected initGlobalListener() {
        super.initGlobalListener();
        this.addGlobalListener(EventConfig.EVT_SHOW_SETTLE, this.onShowSettle, this);
    }

    onShowSettle (data: any) {
        const prefabPath = 'resources/prefab/dialog_settle';
        ya.resourceManager.load(prefabPath, cc.Prefab).then(()=> {
            ya.dialogManager.show(prefabPath, data, {
                showType: ya.DialogShowTypes.SCALE,
                dataLoaded: true,
            });
        });
    }
}

export {SettleController};

import {ya} from "../../framework/ya";
import {EventConfig} from "../../config/EventConfig";
import ResourceConfig from "../../config/resource/ResourceConfig";

class SettingController extends ya.Controller {
    protected initGlobalListener() {
        super.initGlobalListener();

        this.addGlobalListener(EventConfig.EVT_SHOW_PAUSE, this.onShowPause, this);
    }

    onShowPause (data: any) {
        ya.resourceManager.load(ResourceConfig.pause, () => {
            ya.dialogManager.show('Prefab/dialog_pause', data, {
                showType: ya.DialogShowTypes.SCALE,
                dataLoaded: true,
            });
        });
    }
}

export {SettingController};
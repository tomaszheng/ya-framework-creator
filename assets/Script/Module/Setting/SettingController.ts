import ya from "../../Framework/ya";
import EventConfig from "../../Config/EventConfig";
import ResourceConfig from "../../Config/res/ResourceConfig";

export default class SettingController extends ya.Controller {
    initGlobalListener () {
        this.addGlobalListener(EventConfig.EVT_SHOW_PAUSE, this.onShowPause, this);
    }

    onShowPause (params: any) {
        ya.resourceManager.load(ResourceConfig.pause, () => {
            ya.dialogManager.show(new ya.DialogProperty({
                prefab: "prefabs/dialog_pause",
                script: "PauseView",
                dataLoadded: true,
                showType: ya.DialogProperty.ShowTypes.SCALE,
            }), params);
        });
    }
}

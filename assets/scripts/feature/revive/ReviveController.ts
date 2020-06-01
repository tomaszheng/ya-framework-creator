import ya from "../../framework/ya";
import EventConfig from "../../config/EventConfig";
import ResourceConfig from "../../config/resource/ResourceConfig";

export default class ReviveController extends ya.Controller {
    initGlobalListener () {
        this.addGlobalListener(EventConfig.EVT_SHOW_REVIVE, this.onShowRevive, this);
    }

    onShowRevive (params: any) {
        ya.resourceManager.load(ResourceConfig.revive, () => {
            ya.dialogManager.show(new ya.DialogProperty({
                prefab: "Prefab/dialog_revive",
                script: "ReviveView",
                dataLoadded: true,
                showType: ya.DialogProperty.ShowTypes.SCALE
            }), params);
        })
    }
}

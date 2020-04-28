import ya from "../../Framework/ya";
import EventConfig from "../../Config/EventConfig";
import ResourceConfig from "../../Config/res/ResourceConfig";

export default class ReviveController extends ya.Controller {
    initGlobalListener () {
        this.addGlobalListener(EventConfig.EVT_SHOW_REVIVE, this.onShowRevive, this);
    }

    onShowRevive (params: any) {
        ya.resourceManager.load(ResourceConfig.revive, () => {
            ya.dialogManager.show(new ya.DialogProperty({
                prefab: "prefabs/dialog_revive",
                script: "ReviveView",
                dataLoadded: true,
                showType: ya.DialogProperty.ShowTypes.SCALE
            }), params);
        })
    }
}

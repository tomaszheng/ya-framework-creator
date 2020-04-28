import ya from "../../Framework/ya";
import EventConfig from "../../Config/EventConfig";
import ResourceConfig from "../../Config/res/ResourceConfig";

export default class SettleController extends ya.Controller {
    initGlobalListener () {
        this.addGlobalListener(EventConfig.EVT_SHOW_SETTLE, this.onShowSettle, this);
    }

    onShowSettle (params: any) {
        ya.resourceManager.load(ResourceConfig.settle, () => {
            ya.dialogManager.show(new ya.DialogProperty({
                prefab: "prefabs/dialog_settle",
                script: "SettleView",
                dataLoadded: true,
                showType: ya.DialogProperty.ShowTypes.SCALE
            }), params);
        });
    }
}

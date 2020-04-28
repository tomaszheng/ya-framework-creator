import ya from "../../Framework/ya";
import EventConfig from "../../Config/EventConfig";
import ResourceConfig from "../../Config/Resource/ResourceConfig";

export default class SettleController extends ya.Controller {
    initGlobalListener () {
        this.addGlobalListener(EventConfig.EVT_SHOW_SETTLE, this.onShowSettle, this);
    }

    onShowSettle (params: any) {
        ya.resourceManager.load(ResourceConfig.settle, () => {
            ya.dialogManager.show(new ya.DialogProperty({
                prefab: "Prefab/dialog_settle",
                script: "SettleView",
                dataLoadded: true,
                showType: ya.DialogProperty.ShowTypes.SCALE
            }), params);
        });
    }
}

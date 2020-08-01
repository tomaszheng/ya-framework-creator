import ya from "../../framework/ya";
import ResourceConfig from "../../config/resource/ResourceConfig";
import { EventConfig } from "../../config/EventConfig";

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

import ya from "../../framework/ya";
import ResourceConfig from "../../config/resource/ResourceConfig";
import { EventConfig } from "../../config/EventConfig";

export default class MainController extends ya.Controller {
    get prefab () {
        return "prefab/main";
    }

    get component (): string {
        return "MainView";
    }

    initGlobalListener () {
        ya.eventDispatcher.on(EventConfig.EVT_SHOW_ARCHIVE, this.onShowArchive, this);
    }
    
    onShowArchive (params: any) {
        ya.resourceManager.load(ResourceConfig.archive, () => {
            ya.dialogManager.show(new ya.DialogProperty({
                prefab: "prefab/dialog_archive",
                script: "ArchiveView",
                showType: ya.DialogProperty.ShowTypes.SCALE,
                dataLoadded: true,
            }));
        });
    }
}
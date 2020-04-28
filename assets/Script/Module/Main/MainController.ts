import ya from "../../Framework/ya";
import ResourceConfig from "../../Config/Resource/ResourceConfig";
import EventConfig from "../../Config/EventConfig";
import MainView from "./MainView";

export default class MainController extends ya.Controller {
    get prefab () {
        return "Prefab/main";
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
                prefab: "Prefab/dialog_archive",
                script: "ArchiveView",
                showType: ya.DialogProperty.ShowTypes.SCALE,
                dataLoadded: true,
            }));
        });
    }
}
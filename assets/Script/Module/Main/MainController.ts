import ya from "../../Framework/ya";
import ResourceConfig from "../../Config/res/ResourceConfig";
import EventConfig from "../../Config/EventConfig";
import MainView from "./MainView";

export default class MainController extends ya.Controller {
    get prefab () {
        return "prefabs/main";
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
                prefab: "prefabs/dialog_archive",
                script: "ArchiveView",
                showType: ya.DialogProperty.ShowTypes.SCALE,
                dataLoadded: true,
            }));
        });
    }
}
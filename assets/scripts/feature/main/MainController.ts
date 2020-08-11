import ResourceConfig from "../../config/resource/ResourceConfig";
import {EventConfig} from "../../config/EventConfig";
import {ya} from "../../framework/ya";
import {MainView} from "./MainView";

class MainController extends ya.Controller {
    protected _view: MainView;

    public get prefabPath(): string {
        return 'mainView/prefabs/main';
    }

    initGlobalListener() {
        ya.eventDispatcher.add(EventConfig.EVT_SHOW_ARCHIVE, this.onShowArchive, this);
    }

    onShowArchive(params: any) {
        // ya.resourceManager.load(ResourceConfig.archive, () => {
        //     ya.dialogManager.show('prefab/dialog_archive', null, {
        //         showType: ya.DialogShowTypes.SCALE,
        //         dataLoaded: true,
        //     });
        // });
    }
}

export {MainController};
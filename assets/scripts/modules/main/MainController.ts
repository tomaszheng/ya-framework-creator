import {EventConfig} from "../../config/EventConfig";
import {MainView} from "./MainView";
import {BaseController} from "../../framework/mvc/BaseController";
import {eventDispatcher} from "../../framework/event/EventDispatcher";

class MainController extends BaseController {
    public get view(): MainView {
        return this._view as MainView;
    }

    public get prefabPath(): string {
        return 'mainView/prefabs/main';
    }

    initGlobalListener() {
        eventDispatcher.add(EventConfig.EVT_SHOW_ARCHIVE, this.onShowArchive, this);
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

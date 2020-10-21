import {eventDispatcher} from "./event/EventDispatcher";
import {dialogManager} from "./manager/DialogManager";
import {layerManager} from "./manager/LayerManager";
import {soundManager} from "./manager/SoundManager";
import {resourceManager} from "./manager/ResourceManager";

class Ya {
    public static init() {
        layerManager.init();
        eventDispatcher.init();
        resourceManager.init();
        soundManager.init();
        dialogManager.init();
    }
}

const ya = Ya;
export {ya};

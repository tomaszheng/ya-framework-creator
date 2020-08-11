
import {YaBaseComponent} from "./base/ya-base-component";
import {YaController} from "./mvc/ya-controller";
import {YaUtils} from "./utils/ya-utils";
import {YaDialogProperty} from "./mvc/ya-dialog-property";
import {YaFunctions} from "./utils/ya-functions";
import {YaDateUtils} from "./utils/ya-date-utils";
import {YaView} from "./mvc/ya-view";
import {YaModel} from "./mvc/ya-model";
import {YaDialog, YaDialogCharacter, YaDialogShowTypes} from "./mvc/ya-dialog";
import {YaButtonHelper} from "./utils/ya-button-helper";
import {YaUIHelper} from "./utils/ya-ui-helper";
import {yaEventDispatcher} from "./event/ya-event-dispatcher";
import {yaLocalStorage} from "./storage/ya-local-storage";
import {yaDialogManager} from "./manager/ya-dialog-manager";
import {yaLayerManager} from "./manager/ya-layer-manager";
import {yaSoundManager} from "./manager/ya-sound-manager";
import {yaViewManager} from "./manager/ya-view-manager";
import {yaResourceManager} from "./manager/ya-resource-manager";
import {YaStorageConfig} from "./config/ya-storage-config";

class Ya {
    public static BaseComponent = YaBaseComponent;
    public static Model = YaModel;
    public static View = YaView;
    public static Dialog = YaDialog;
    public static DialogShowTypes = YaDialogShowTypes;
    public static DialogCharacter = YaDialogCharacter;
    public static DialogProperty = YaDialogProperty;
    public static Controller = YaController;

    public static utils = YaUtils;
    public static func = YaFunctions;
    public static dates = YaDateUtils;
    public static button = YaButtonHelper;
    public static uiHelper = YaUIHelper;

    public static soundManager = yaSoundManager;
    public static dialogManager = yaDialogManager;
    public static viewManager = yaViewManager;
    public static layerManager = yaLayerManager;
    public static resourceManager = yaResourceManager;
    public static eventDispatcher = yaEventDispatcher;
    public static localStorage = yaLocalStorage;

    public static StorageConfig = YaStorageConfig;

    public static init() {
        this.layerManager.init();
        this.eventDispatcher.init();
        this.soundManager.init();
        this.dialogManager.init();
    }
}

const ya = Ya;
export {ya};

import YAModel from "./mvc/ya-model";
import YAView from "./mvc/ya-view";
import YADialog from "./mvc/ya-dialog";
import YADialogProperty from "./mvc/ya-dialog-property";
import YAController from "./mvc/ya-controller";

import YAStorageConfig from "./config/ya-storage-config";

import YADialogManager from "./manager/ya-dialog-manager";
import YALayerManager from "./manager/ya-layer-manager";
import YASoundManager from "./manager/ya-sound-manager";
import YAViewManager from "./manager/ya-view-manager";
import YAResourceManager from "./manager/ya-resource-manager";
import YAUtils from "./utils/ya-utils";
import YAFunctions from "./utils/ya-functions";
import YADateUtils from "./utils/ya-date-utils";
import YAEventDispatcher from "./event/ya-event-dispatcher";
import YALocalStorage from "./storage/ya-local-storage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ya {

    static Model = YAModel;
    static View = YAView;
    static Dialog = YADialog;
    static DialogProperty = YADialogProperty;
    static Controller = YAController;

    static StorageConfig = YAStorageConfig;

    static utils = YAUtils;
    static funcs = YAFunctions;
    static dates = YADateUtils;

    static layer = {
        top: null,
        dialog: null,
        view: null,
    };

    static soundManager: YASoundManager;
    static dialogManager: YADialogManager;
    static viewManager: YAViewManager;
    static layerManager: YALayerManager;
    static resourceManager: YAResourceManager;
    static eventDispatcher: YAEventDispatcher;
    static localStorage: YALocalStorage;

    private static _instance = null;
    static getInstance(): ya {
        if (!this._instance) {
            this._instance = new ya();
        }
        return this._instance;
    }

    private constructor() {
        ya.layerManager = YALayerManager.getInstance();
        ya.layerManager.top = ya.layer.top;
        ya.layerManager.dialog = ya.layer.dialog;
        ya.layerManager.view = ya.layer.view;

        ya.soundManager = YASoundManager.getInstance();
        ya.dialogManager = YADialogManager.getInstance();
        ya.viewManager = YAViewManager.getInstance();
        ya.resourceManager = YAResourceManager.getInstance();
        ya.eventDispatcher = YAEventDispatcher.getInstance();
        ya.localStorage = YALocalStorage.getInstance();
    }
}
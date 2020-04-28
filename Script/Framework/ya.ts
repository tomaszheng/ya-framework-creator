
import YAModel from "./MVC/YAModel";
import YAView from "./MVC/YAView";
import YADialog from "./MVC/YADialog";
import YADialogProperty from "./MVC/YADialogProperty";
import YAController from "./MVC/YAController";

import YAStorageConfig from "./Config/YAStorageConfig";

import YASoundManager from "./Manager/YASoundManager";
import YADialogManager from "./Manager/YADialogManager";
import YAViewManager from "./Manager/YAViewManager";
import YAResourceManager from "./Manager/YAResourceManager";
import YAUtils from "./Utils/YAUtils";
import YAFunctions from "./Utils/YAFunctions";
import YADateUtils from "./Utils/DateUtils";
import YAEventDispatcher from "./Event/YAEventDispatcher";
import YALocalStorage from "./Storage/YALocalStorage";

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

    static soundManager: YASoundManager = null;
    static dialogManager: YADialogManager = null;
    static viewManager: YAViewManager = null;
    static resourceManager: YAResourceManager = null;
    static eventDispatcher: YAEventDispatcher = null;
    static localStorage: YALocalStorage = null;

    private static _instance = null;
    static getInstance(): ya {
        if (!this._instance) {
            this._instance = new ya();
        }
        return this._instance;
    }

    private constructor() {
        ya.soundManager = YASoundManager.getInstance();
        ya.dialogManager = YADialogManager.getInstance();
        ya.viewManager = YAViewManager.getInstance();
        ya.resourceManager = YAResourceManager.getInstance();
        ya.eventDispatcher = YAEventDispatcher.getInstance();
        ya.localStorage = YALocalStorage.getInstance();
    }

}
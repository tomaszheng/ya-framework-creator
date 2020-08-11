/*
视图管理器
统一处理视图、弹窗的生命周期：显示、关闭
*/

import {YaDialogProperty} from "../mvc/ya-dialog-property";
import {Singleton} from "../singleton/Singleton";
import {YaDialog, YaDialogCharacter, YaDialogShowTypes} from "../mvc/ya-dialog";
import {yaLayerManager} from "./ya-layer-manager";
import getClassName = cc.js.getClassName;

interface IOption {
    showType?: YaDialogShowTypes;
    character?: number;
    dataLoaded?: boolean;
}

interface IWaitingData {
    id: number;
    option: IOption;
    prefabPath?: string;
    classname?: string;
    data?: any;
}

class YaDialogManager extends Singleton<YaDialogManager> {

    public get root() {
        return yaLayerManager.dialog;
    }

    public set zIndex(zIndex: number) {
        this._zIndex = zIndex;
    }

    public get zIndex() {
        return this._zIndex++;
    }

    private static _idSeed = 0;

    private _waitingList = [];
    private _dialogs = [];

    private _zIndex = 0;
    private _background: cc.Node = null;

    public static nextId() {
        return this._idSeed++;
    }

    private static generateDefaultWaitingData(prefabOrClassname: string, data: any, option: IOption) {
        if (!option.showType) {
            option.showType = YaDialogShowTypes.SCALE;
        }
        if (!option.character) {
            option.character = YaDialogCharacter.UNIQUE;
        }
        option.dataLoaded = !!option.dataLoaded;

        let prefabPath = '';
        let classname = '';
        if (prefabOrClassname.indexOf('/') === -1) {
            classname = prefabOrClassname;
        } else {
            prefabPath = prefabOrClassname;
        }

        const id = YaDialogManager.nextId();
        const waitingData: IWaitingData = {
            id,
            data,
            prefabPath,
            classname,
            option
        };
        return waitingData;
    }

    private static isSameClass(waitingData: IWaitingData, dialog: YaDialog) {
        if (waitingData.classname && cc.js.getClassName(dialog) === waitingData.classname) return true;
        return waitingData.prefabPath && dialog.instantiatedPrefabPath === waitingData.prefabPath;
    }

    public init() {
        this.root.setContentSize(cc.winSize);
        this.root.setAnchorPoint(cc.v2());
        this.zIndex = this.root.zIndex;
    }

    getDialog(id: number) {
        for (const dialog of this._dialogs) {
            if (dialog.id === id) {
                return dialog;
            }
        }
    }

    private _checkBackground() {
        if (!this._background) {
            const node = new cc.Node();
            const sprite = node.addComponent(cc.Sprite);
            sprite.type = cc.Sprite.Type.SLICED;
            sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
            node.color = cc.color(0, 0, 0);
            node.active = false;
            node.opacity = 0;
            node.anchorX = node.anchorY = 0;
            node.parent = this.root;
            node.setContentSize(cc.winSize);
            this._background = node;
        }

        if (this._dialogs.length <= 0) {
            this._background.active = false;
        } else {
            const active = this._background.active;
            this._background.active = true;
            if (!active) {
                cc.Tween.stopAllByTarget(this._background);
                this._background.opacity = 0;
                cc.tween(this._background).to(0.2, {fade: 178});
            }
            this._background.zIndex = this.getLastSiblingZIndex() - 1;
        }
    }

    public getLastSiblingZIndex() {
        let zIndex = 0;
        if (this._dialogs.length > 0) {
            zIndex = this._dialogs[this._dialogs.length - 1].node.zIndex;
        }
        return zIndex;
    }

    /**
     * 用于弹窗队列，与pop方法配合使用
     * @param prefabOrClassname
     * @param data
     * @param option
     */
    public push(prefabOrClassname: string, data: any, option: IOption) {
        const waitingData = YaDialogManager.generateDefaultWaitingData(prefabOrClassname, data, option);
        this._waitingList.splice(0, 0, waitingData);
    }

    public pop() {
        if (this._waitingList.length <= 0) return;

        if (this._dialogs.length > 0) {
            const dialog = this._dialogs[this._dialogs.length - 1];
            if (dialog.node.active && (dialog.character & YaDialogCharacter.TOP) > 0) {
                if ((this._waitingList[0].character & YaDialogCharacter.TOP) > 0) {
                    return;
                }
            }
        }

        const waitingData = this._waitingList.shift();
        this._show(waitingData);
    }

    /*
    _hide 私有方法，外部不能调用
        新界面被打开，隐藏当前已经显示的界面
        逻辑控制
            如果当前界面设置了ALWAYS_SHOW=true 不隐藏当前界面
    */
    /**
     * 当新界面被打开时，隐藏原先最顶部的弹窗
     */
    private _hide() {
        if (this._dialogs.length > 0) {
            const dialog = this._dialogs[this._dialogs.length - 1];
            if ((dialog.character & YaDialogCharacter.RESIDENT) > 0) {
                dialog.hide();
            }
        }
    }

    private _unique(waitingData: IWaitingData) {
        if (this._dialogs.length <= 0) return;

        this._dialogs.some((dialog, i) => {
            if (YaDialogManager.isSameClass(waitingData, dialog) && (dialog.character & YaDialogCharacter.UNIQUE) > 0) {
                dialog.node.destroy();
                this._dialogs.splice(i, 1);
            }
        });
    }

    public show(prefabOrClassname: string, data: any, option: IOption) {
        // 打开一个界面之前先检查弹窗层状态
        // this.reset();

        const waitingData = YaDialogManager.generateDefaultWaitingData(prefabOrClassname, data, option);

        this._hide();
        this._unique(waitingData);

        this._show(waitingData);

        this._checkBackground();
    }

    private _show(waitingData: IWaitingData) {
        const handler = cc.instantiate(cc.loader.getRes(waitingData.prefabPath));
        const dialog = handler.getComponent(YaDialog);

        this._dialogs.push(dialog);

        dialog.id = waitingData.id;
        dialog.showType = waitingData.option.showType;
        dialog.character = waitingData.option.character;
        dialog.dataLoaded = waitingData.option.dataLoaded;
        dialog.init(waitingData.data);
        dialog.show();

        dialog.node.parent = this.root;
        dialog.node.zIndex = ++this.zIndex;
    }

    private _remove(id: number) {
        if (this._dialogs.length <= 0) return;

        this._dialogs.some((dialog, i) => {
            if (dialog.id === id) {
                dialog.node.destroy();
                this._dialogs.splice(i, 1);
                return true;
            }
        });
    }

    public remove(ids: number | number[]) {
        if (ids instanceof Array) {
            ids.forEach((id) => {
                this._remove(id);
            });
        } else {
            this._remove(ids);
        }

        this._check();

        this._checkBackground();
    }

    private _check() {
        const length = this._dialogs.length;
        if (this._dialogs.length > 0) {
            const dialog = this._dialogs[length - 1];
            if (!dialog.node.active) {
                dialog.display();
            }
        } else if (this._waitingList.length > 0) {
            this.pop();
        }
    }

    public clear() {
        this._waitingList = [];

        this._dialogs.forEach((dialog) => {
            dialog.node.destroy();
        });
        this._dialogs = [];
    }
}

const yaDialogManager = YaDialogManager.instance(YaDialogManager);
export {yaDialogManager};
/*
控制器基类
*/

import {layerManager} from "../manager/LayerManager";
import {BaseView} from "./BaseView";
import {eventDispatcher} from "../event/EventDispatcher";
import {uiUtils} from "../utils/UIUtils";
import {BaseModel} from "./BaseModel";

interface IEventRecord {
    name: string;
    callback: (args) => void;
    target?: BaseController;
}

class BaseController {
    public get view() {
        return this._view;
    }

    public get model() {
        return this._model;
    }

    public get prefabPath(): string {
        return '';
    }

    public get viewClassname(): string {
        return '';
    }

    public get root() {
        return layerManager.view;
    }

    private readonly _events: IEventRecord[] = [];
    protected _view: BaseView = null;
    protected _model: BaseModel = null;

    public constructor() {
        this.initData();
        this.initGlobalListener();
    }

    protected initData() {
        // TODO init model
    }

    protected initGlobalListener() {
        // 这里使用addGlobalListener添加事件
    }

    /**
     * 增加一个跟Controller相关的全局事件监听
     * @param name 事件名
     * @param callback 回调函数
     * @param target 目标
     */
    public addGlobalListener(name: string, callback: (args) => void, target?: BaseController) {
        target = target || this;
        eventDispatcher.on(name, callback, target);
    }

    /**
     * 控制器事件，随着主view销毁而销毁
     */
    protected initLifeListener() {
        // 这里使用addLifeListener添加事件
        // 销毁事件时使用clearListeners
    }

    /**
     * 增加一个只跟Controller对应的View生命周期相关的事件监听
     * @param name 事件名
     * @param callback 监听
     * @param target 目标
     */
    public addLifeListener(name: string, callback: (args) => void, target?: BaseController) {
        target = target || this;
        this.addGlobalListener(name, callback, target);
        this._events.push({name, callback, target});
    }

    private createView(data: any): void {
        if (this.prefabPath) {
            const promise = uiUtils.loadAndInstantiate(this.prefabPath, data, this.root);
            promise.then((node) => {
                this.doCreateView(node, data);
            });
        } else {
            const node = new cc.Node(this.viewClassname);
            node.parent = this.root;
            this.doCreateView(node, data);
        }
    }

    private doCreateView(node: cc.Node, data: any) {
        let view = node.getComponent(BaseView);
        if (!view) {
            if (!this.viewClassname) {
                cc.error(`Not found component 'YaBaseComponent', please check.`);
                return;
            }
            view = node.addComponent(this.viewClassname);
            view.init(data);
        }

        this._view = view;
    }

    public show(data?: any): void {
        if (!this._view) {
            this.initLifeListener();
            this.createView(data);
        } else {
            if (!this._view.node.active) {
                this._view.node.active = true;
            }
        }
    }

    public remove(): void {
        this.clearListeners();
        this.removeView();
    }

    public clearListeners() {
        this._events.every((event: IEventRecord) => {
            eventDispatcher.off(event.name, event.callback, event.target);
        });
        this._events.length = 0;
    }

    private removeView() {
        if (this._view) {
            this._view.node.destroy();
            this._view = null;
        }
    }

    public hide() {
        if (this._view && this._view.node.active) {
            this._view.node.active = false;
        }
    }

    public display() {
        if (this._view && !this._view.node.active) {
            this._view.node.active = true;
        }
    }
}

export {BaseController};

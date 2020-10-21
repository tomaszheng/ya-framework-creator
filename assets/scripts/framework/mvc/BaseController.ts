/*
控制器基类
*/

import {layerManager} from "../manager/LayerManager";
import {BaseView} from "./BaseView";
import {eventDispatcher} from "../event/EventDispatcher";
import {resourceManager} from "../manager/ResourceManager";
import {uiUtils} from "../utils/UIUtils";
import {BaseModel} from "./BaseModel";

interface IEventRecord {
    name: string;
    callback: (args) => void;
    target?: cc.Node;
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

    private readonly events: IEventRecord[];
    protected _view: BaseView;
    protected _model: BaseModel;

    public constructor() {
        this.events = [];

        this.initData();

        this.initGlobalListener();
    }

    protected initData() {
        // TODO init model
    }

    /**
     * 初始化全局事件监听
     */
    protected initGlobalListener() {
        // 这里使用addGlobalListener添加事件
    }

    /**
     * 控制器事件，随着主view销毁而销毁
     */
    protected initLifeListener() {
        // 这里使用addModuleEvent添加事件
        // 销毁事件时使用clearModuleEvent
    }

    private createView(data: any): void {
        if (this.prefabPath) {
            const promise = uiUtils.instantiatePath(this.prefabPath, data, this.root);
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

    /**
     * 显示或创建当前视图
     * @param data 参数
     */
    public show(data: any): void {
        if (!this._view) {
            this.initLifeListener();
            this.createView(data);
        } else {
            if (!this._view.node.active) {
                this._view.node.active = true;
            }
        }
    }

    /**
     * 移除当前视图
     */
    public remove(): void {
        this.clearListeners();

        if (this._view) {
            this._view.node.destroy();
            this._view = null;
        }
    }

    /**
     * 隐藏当前视图
     */
    public hide() {
        if (this._view && this._view.node.active) {
            this._view.node.active = false;
        }
    }

    /**
     * 显示当前视图
     */
    public display() {
        if (this._view && !this._view.node.active) {
            this._view.node.active = true;
        }
    }

    /**
     * 增加一个只跟Controller相关的全局事件监听
     * @param name 事件名
     * @param callback 监听
     * @param target 目标
     */
    public addGlobalListener(name: string, callback: (args) => void, target: any) {
        target = target || this;

        eventDispatcher.add(name, callback, target);
    }

    /**
     * 增加一个跟Controller对应的View生命周期相关的事件监听
     * @param name 事件名
     * @param callback 监听
     * @param target 目标
     */
    public addLifeListener(name: string, callback: (args) => void, target: any) {
        this.addGlobalListener(name, callback, target);

        this.events.push({
            name,
            callback,
            target: target || this.view,
        });
    }

    public clearListeners() {
        this.events.every((event) => {
            eventDispatcher.remove(event.name, event.callback, event.target);
        });
        this.events.length = 0;
    }
}

export {BaseController};

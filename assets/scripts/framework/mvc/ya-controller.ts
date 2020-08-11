/*
控制器基类
*/

import {yaLayerManager} from "../manager/ya-layer-manager";
import {YaView} from "./ya-view";
import {yaEventDispatcher} from "../event/ya-event-dispatcher";

interface IEventRecord {
    name: string;
    callback: (args)=>void;
    target?: cc.Node;
}

class YaController {
    protected _view: YaView = null;
    public get view() {
        return this._view;
    }

    public get prefabPath(): string {
        return '';
    }
    get prefab(): string {
        return null;
    }

    get component(): string {
        return null;
    }

    public get viewName(): string {
        return '';
    }

    public get root() {
        return yaLayerManager.view;
    }

    protected _model: any = null;
    public get model() {
        return this._model;
    }

    public set model(m) {
        this._model = m;
    }

    private readonly events: IEventRecord[];

    constructor() {
        this.events = [];

        this.initGlobalListener();
    }

    protected initModel() {

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

    public createView(args: any): void {
        let node: cc.Node = null;
        if (this.prefabPath) {
            const obj = cc.loader.getRes(this.prefabPath);
            node = cc.instantiate(obj);
        } else {
            node = new cc.Node();
        }

        let view = node.getComponent(YaView);
        if (!view) {
            view = node.addComponent(this.viewName);
        }

        this._view = view;
        this._view.node.parent = this.root;

        view.init(args);
    }

    /**
     * 显示或创建当前视图
     * @param args 参数
     */
    public show(args: any): void {
        if (!this._view) {
            this.initModel();
            this.initLifeListener();

            this.createView(args);
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

        yaEventDispatcher.add(name, callback, target);
    }

    /**
     * 增加一个跟Controller对应的View生命周期相关的事件监听
     * @param name 事件名
     * @param callback 监听
     * @param target 目标
     */
    public addLifeListener(name: string, callback: (args)=>void, target: any) {
        this.addGlobalListener(name, callback, target);

        this.events.push({
            name,
            callback,
            target: target || this.view,
        });
    }

    public clearListeners() {
        this.events.every((event) => {
            yaEventDispatcher.remove(event.name, event.callback, event.target);
        });
        this.events.length = 0;
    }
}

export {YaController};
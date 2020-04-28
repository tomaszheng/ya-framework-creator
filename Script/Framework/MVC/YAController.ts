
/*
控制器基类
*/

import YAEventDispatcher from "../Event/YAEventDispatcher";
import YALayerManager from "../Manager/YALayerManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class YAController {
    _view = null;
    get view() {
        return this._view;
    }
    set view(v) {
        this._view = v;
    }

    get prefab (): string {
        return null;
    }

    get component (): string {
        return null;
    }

    get root() {
        return YALayerManager.getInstance().view;
    }

    _model = null;
    get model() {
        return this._model;
    }
    set model(m) {
        this._model = m;
    }

    private events = [];

    constructor() {
        this.initGlobalListener();
    }

    initModel() {

    }

    /**
     * 初始化全局事件监听
     */
    initGlobalListener() {
        // 这里使用addGlobalListener添加事件
    }

    /**
     * 控制器事件，随着主view销毁而销毁
     */
    initLifeListener() {
        // 这里使用addModuleEvent添加事件
        // 销毁事件时使用clearModuleEvent
    }

    createView (params: any) {
        let node = null, view = null;

        if (this.prefab) {
            node = cc.instantiate(this.prefab);
        }
        else {
            node = new cc.Node();
        }
        
        view  = node.getComponent(this.component);
        if (!view) {
            view = node.addComponent(this.component);
        }
        view.init(params);
        
        return view;
    }

    /**
     * 显示或创建当前视图
     * @param params 参数
     */
    show (params: any) {
        if (!this.view) {
            this.view = this.createView(params);
            if (this.view) {
                this.root.addChild(this.view.node);
    
                this.initModel();
                this.initLifeListener();
            }
        }
        else {
            if (!this.view.active) {
                this.view.active = true;
            }
        }

        return this.view;
    }

    /**
     * 移除当前视图
     */
    remove () {
        if (this.view) {
            this.cleanListener();

            this.view.node.destroy();
            this.view = null;
        }
    }

    /**
     * 隐藏当前视图
     */
    hide () {
        if (this.view && this.view.node.active) {
            this.view.node.active = false;
        }
    }
    
    /**
     * 显示当前视图
     */
    display () {
        if (this.view && !this.view.node.active) {
            this.view.node.active = true;
        }
    }

    /**
     * 增加一个只跟Controller相关的全局事件监听
     * @param name 事件名
     * @param callback 监听
     * @param target 目标
     */
    addGlobalListener (name:string, callback:Function, target:any) {
        target = target || this;

        YAEventDispatcher.getInstance().on(name, callback, target);
    }

    /**
     * 增加一个跟Controller对应的View生命周期相关的事件监听
     * @param name 事件名
     * @param callback 监听
     * @param target 目标
     */
    addLifeListener (name:string, callback:Function, target:any) {
        this.addGlobalListener(name, callback, target);

        this.events.push({
            name: name,
            callback: callback,
            target: target || this.view,
        });
    }

    cleanListener() {
        for (let i = 0; i < this.events.length; i++) {
            let event = this.events[i];
            YAEventDispatcher.getInstance().off(event.name, event.callback, event.target);
        }
        this.events.length = 0;
    }
}

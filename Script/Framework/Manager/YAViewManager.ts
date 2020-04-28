/*
模块管理器
统一初始化Controller，并持有所有Controller的句柄
*/

import YAController from "../MVC/YAController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class YAViewManager {
    static CLASS_NAME = "YAViewManager";

    static _instance:YAViewManager = null;
    static getInstance():YAViewManager {
        if (this._instance) {
            this._instance = new YAViewManager();
        }
        return this._instance;
    }

    controllers = [];
    stack = [];

    private constructor () {

    }

    register (name: string, controller: YAController) {
        if (!this.isViewExist(name)) {
            this.controllers[name] = controller;
        }
    }

    isViewExist (name: string) {
        return !!this.controllers[name];
    }

    get (name: string) {
        return this.controllers[name];
    }

    /**
     * 显示某一视图模块
     * @param name 待显示的模块名称
     * @param data 传给视图的初始数据
     * @param cleanly 显示视图之前是否要清理其他已打开的视图
     */
    show (name: string, data?: any, cleanly?: boolean) {
        data = data || null;
        cleanly = cleanly || false;

        if (cleanly) {
            this.clean();
        }

        let controller = this.controllers[name];
        if (!controller) {
            cc.warn(`Not Found: ${name} in show fun of ${YAViewManager.CLASS_NAME}`);
            return;
        }

        controller.show(data);

        this.stack.push(name);
    }

    /**
     * 隐藏除了栈顶视图之外的其他所有视图
     */
    hide () {
        let controller:YAController;
        for (let i = 0; i < this.stack.length - 1; i++) {
            controller = this.controllers[this.stack[i]];
            controller && controller.hide();
        }
    }

    /**
     * 移除某一视图模块
     * @param name 视图名称
     */
    remove (name: string) {
        let controller = this.get(name);
        if (!controller) {
            cc.warn(`Not Found: ${name} in remove fun of ${YAViewManager.CLASS_NAME}`);
            return;
        }

        controller.remove();

        for (let i = 0; i < this.stack.length; i++) {
            if (this.stack[i] === name) {
                if (i === this.stack.length - 1 && i !== 0) {
                    controller = this.controllers[this.stack[i - 1]];
                    controller && controller.display();
                }
                this.stack.splice(i, 1);
                break;
            }
        }
    }

    /**
     * 移除所有的视图模块
     */
    clean () {
        let name: string, controller: YAController;
        while (this.stack.length > 0) {
            name = this.stack.pop();
            controller = this.get(name);

            controller && controller.remove();
        }
    }
}

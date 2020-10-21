/*
模块管理器
统一初始化Controller，并持有所有Controller的句柄
*/

import {BaseController} from "../mvc/BaseController";
import {Singleton} from "../singleton/Singleton";

class ViewManager extends Singleton<ViewManager> {

    views: string[] = [];
    controllers: BaseController[] = [];

    public register(name: string, controller: BaseController) {
        if (!this.isViewExist(name)) {
            this.controllers[name] = controller;
        }
    }

    public isViewExist(name: string) {
        return !!this.controllers[name];
    }

    public get(name: string) {
        return this.controllers[name];
    }

    public show(name: string, data?: any, cleanly?: boolean) {
        const controller = this.controllers[name];
        if (!controller) {
            cc.error(`Not found view '${name}`);
            return;
        }

        controller.show(data);

        if (cleanly) this.clear();

        this.views.push(name);
    }

    public hide() {
        let controller: BaseController;
        for (let i = 0; i < this.views.length - 1; i++) {
            controller = this.controllers[this.views[i]];
            if (controller) controller.hide();
        }
    }

    public remove(name: string) {
        let controller = this.get(name);
        if (!controller) return;

        controller.remove();

        this.views.some((viewName, i) => {
            if (viewName === name) {
                if (i === this.views.length - 1 && i !== 0) {
                    controller = this.controllers[this.views[i - 1]];
                    controller.display();
                }
                this.views.splice(i, 1);
                return true;
            }
        });
    }

    public clear() {
        let name: string;
        let controller: BaseController;
        while (this.views.length > 0) {
            name = this.views.pop();
            controller = this.get(name);
            if (controller) controller.remove();
        }
    }
}

const viewManager = ViewManager.instance(ViewManager);
export {viewManager};

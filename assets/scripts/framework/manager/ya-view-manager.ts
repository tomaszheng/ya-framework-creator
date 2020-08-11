/*
模块管理器
统一初始化Controller，并持有所有Controller的句柄
*/

import {YaController} from "../mvc/ya-controller";
import {Singleton} from "../singleton/Singleton";

class YaViewManager extends Singleton<YaViewManager> {

    views: string[] = [];
    controllers: YaController[] = [];

    public register(name: string, controller: YaController) {
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
        if (cleanly) this.clear();

        const controller = this.controllers[name];
        if (!controller) {
            cc.error(`Not found view '${name}`);
            return;
        }

        controller.show(data);

        this.views.push(name);
    }

    public hide() {
        let controller: YaController;
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
        let controller: YaController;
        while (this.views.length > 0) {
            name = this.views.pop();
            controller = this.get(name);
            if (controller) controller.remove();
        }
    }
}

const yaViewManager = YaViewManager.instance(YaViewManager);
export {yaViewManager};
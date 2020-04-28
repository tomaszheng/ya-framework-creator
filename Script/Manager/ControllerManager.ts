import ya from "../Framework/ya";
import GlobalController from "../Module/Global/GlobalController";

export default class ControllerManager {

    static _instance:ControllerManager = null;
    static getInstance():ControllerManager {
        if (this._instance) {
            this._instance = new ControllerManager();
        }
        return this._instance;
    }

    private constructor () {
        this.initControllers();
    }

    private initControllers () {
        ya.viewManager.register("global", new GlobalController());
    }

}
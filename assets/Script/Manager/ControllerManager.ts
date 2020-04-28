import ya from "../Framework/ya";
import GlobalController from "../Module/Global/GlobalController";
import MainController from "../Module/Main/MainController";
import LoadingController from "../Module/Loading/LoadingController";

export default class ControllerManager {

    private static _instance: ControllerManager = null;
    static getInstance(): ControllerManager {
        if (!this._instance) {
            this._instance = new ControllerManager();
        }
        return this._instance;
    }

    private constructor () {
        this.initControllers();
    }

    private initControllers () {
        ya.viewManager.register("global", new GlobalController());
        ya.viewManager.register("loading", new LoadingController());
        ya.viewManager.register("main", new MainController());
    }

}
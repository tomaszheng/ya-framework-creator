import ya from "../framework/ya";
import CommonController from "../feature/common/CommonController";
import MainController from "../feature/main/MainController";
import LoadingController from "../feature/loading/LoadingController";
import RankController from "../feature/rank/RankController";

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
        ya.viewManager.register("common",   new CommonController());
        ya.viewManager.register("loading",  new LoadingController());
        ya.viewManager.register("main",     new MainController());
        ya.viewManager.register("rank",     new RankController());
    }
}
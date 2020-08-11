import {ya} from "../framework/ya";
import {LoadingController} from "../feature/loading/LoadingController";
import {CommonController} from "../feature/common/CommonController";
import {RankController} from "../feature/rank/RankController";
import {MainController} from "../feature/main/MainController";

class ControllerManager extends ya.Singleton<ControllerManager> {
    public init() {
        ya.viewManager.register("common",   new CommonController());
        ya.viewManager.register("loading",  new LoadingController());
        ya.viewManager.register("main",     new MainController());
        ya.viewManager.register("rank",     new RankController());
    }
}

const controllerManager = ControllerManager.instance(ControllerManager);
export {controllerManager};
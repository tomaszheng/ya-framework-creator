import {ya} from "../framework/ya";
import {LoadingController} from "../modules/loading/LoadingController";
import {CommonController} from "../modules/common/CommonController";
import {RankController} from "../modules/rank/RankController";
import {MainController} from "../modules/main/MainController";

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

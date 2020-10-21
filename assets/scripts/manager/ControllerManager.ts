import {LoadingController} from "../modules/loading/LoadingController";
import {CommonController} from "../modules/common/CommonController";
import {RankController} from "../modules/rank/RankController";
import {MainController} from "../modules/main/MainController";
import {Singleton} from "../framework/singleton/Singleton";
import {viewManager} from "../framework/manager/ViewManager";

class ControllerManager extends Singleton<ControllerManager> {
    public init() {
        viewManager.register("common",   new CommonController());
        viewManager.register("loading",  new LoadingController());
        viewManager.register("main",     new MainController());
        viewManager.register("rank",     new RankController());
    }
}

const controllerManager = ControllerManager.instance(ControllerManager);
export {controllerManager};

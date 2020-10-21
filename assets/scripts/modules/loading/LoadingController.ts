import {LoadingView} from "./LoadingView";
import {BaseController} from "../../framework/mvc/BaseController";

class LoadingController extends BaseController {
    protected _view: LoadingView = null;

    public get viewClassname() {
        return 'LoadingView';
    }
}

export {LoadingController};

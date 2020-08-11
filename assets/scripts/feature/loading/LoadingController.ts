/*
加载界面控制器
*/

import {ya} from "../../framework/ya";
import {LoadingView} from "./LoadingView";

class LoadingController extends ya.Controller {
    protected _view: LoadingView;

    public get viewName() {
        return 'LoadingView';
    }
}

export {LoadingController};
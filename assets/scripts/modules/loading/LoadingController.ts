/*
加载界面控制器
*/

import {ya} from "../../framework/ya";
import {LoadingView} from "./LoadingView";

class LoadingController extends ya.Controller {
    protected _view: LoadingView;

    public get viewClassname() {
        return 'LoadingView';
    }
}

export {LoadingController};

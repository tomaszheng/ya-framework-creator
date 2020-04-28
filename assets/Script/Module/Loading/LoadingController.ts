/*
加载界面控制器
*/

import ya from "../../Framework/ya";
import LoadingView from "./LoadingView";

export default class LoadingController extends ya.Controller {
    get component () {
        return "LoadingView";
    }
}
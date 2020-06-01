/*
加载界面控制器
*/

import ya from "../../framework/ya";

export default class LoadingController extends ya.Controller {
    get component () {
        return "LoadingView";
    }
}
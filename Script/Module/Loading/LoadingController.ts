/*
加载界面控制器
*/

import ya from "../../Framework/ya";

export default class GlobalController extends ya.Controller {
    get component () {
        return "LoadingView";
    }
}
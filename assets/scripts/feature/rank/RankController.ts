import ya from "../../framework/ya";

export default class RankController extends ya.Controller{
    get prefab () {
        return 'prefab/rank';
    }

    get component () {
        return 'RankView';
    }
}
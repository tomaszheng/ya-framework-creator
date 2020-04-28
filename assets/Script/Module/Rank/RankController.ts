import ya from "../../Framework/ya";

export default class RankController extends ya.Controller{
    get prefab () {
        return 'Prefab/rank';
    }

    get component () {
        return 'RankView';
    }
}
import ya from "../../Framework/ya";

export default class RankController extends ya.Controller{
    get prefab () {
        return 'prefabs/rank';
    }

    get component () {
        return 'RankView';
    }
}
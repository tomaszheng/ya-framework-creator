import {ya} from "../../framework/ya";
import {RankView} from "./RankView";

class RankController extends ya.Controller {
    public get view(): RankView {
        return this._view as RankView;
    }

    public get prefabPath(): string {
        return 'rankView/prefabs/rank';
    }
}

export {RankController};

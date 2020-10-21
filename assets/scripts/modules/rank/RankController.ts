import {RankView} from "./RankView";
import {BaseController} from "../../framework/mvc/BaseController";

class RankController extends BaseController {
    protected _view: RankView;

    public get prefabPath(): string {
        return 'rankView/prefabs/rank';
    }
}

export {RankController};

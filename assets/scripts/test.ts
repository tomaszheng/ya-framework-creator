import {lodash} from "./framework/libs/lib";
import {RecycleView} from "./framework/components/recycle-view/RecycleView";
import {ya} from "./framework/ya";
import {GridRecycleView} from "./framework/components/recycle-view/GridRecycleView";
import {buttonHelper} from "./framework/utils/ButtonHelper";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Test extends cc.Component {
    @property(RecycleView) verticalRecycleView: RecycleView = null;
    @property(RecycleView) horizontalRecycleView: RecycleView = null;
    @property(GridRecycleView) gridRecycleView: GridRecycleView = null;
    @property(GridRecycleView) hGridRecycleView: GridRecycleView = null;
    @property(cc.Button) btnVerticalPush: cc.Button = null;
    @property(cc.Button) btnVerticalInsert: cc.Button = null;

    private _totalCount = 0;

    protected start() {
        ya.init();

        this._totalCount = 2;
        const data = [];
        lodash.times(this._totalCount, (i) => {
            data.push(i);
        });

        this.gridRecycleView.bindData(lodash.clone(data));
        this.hGridRecycleView.bindData(lodash.clone(data));
        this.verticalRecycleView.bindData(lodash.clone(data));
        this.horizontalRecycleView.bindData(lodash.clone(data));

        buttonHelper.addClick(this.btnVerticalPush.node, this.onClickPush, this);
        buttonHelper.addClick(this.btnVerticalInsert.node, this.onClickInsert, this);
    }

    private onClickPush() {
        this.gridRecycleView.updateItem(30, this._totalCount);
        this.hGridRecycleView.updateItem(30, this._totalCount);
        this.verticalRecycleView.updateItem(30, this._totalCount);
        this.horizontalRecycleView.updateItem(30, this._totalCount++);
    }

    private onClickInsert() {
        const i = lodash.random(0, 5);
        this.gridRecycleView.updateItem(i, this._totalCount);
        this.hGridRecycleView.updateItem(i, this._totalCount);
        this.verticalRecycleView.updateItem(i, this._totalCount);
        this.horizontalRecycleView.updateItem(i, this._totalCount++);
    }
}

import {lodash} from "./framework/libs/LibEntry";
import {YaRecycleView} from "./framework/components/recycle-view/YaRecycleView";
import {ya} from "./framework/ya";
import {YaGridRecycleView} from "./framework/components/recycle-view/YaGridRecycleView";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Test extends cc.Component {
    @property(YaRecycleView) verticalRecycleView: YaRecycleView = null;
    @property(YaRecycleView) horizontalRecycleView: YaRecycleView = null;
    @property(YaGridRecycleView) gridRecycleView: YaGridRecycleView = null;
    @property(YaGridRecycleView) hGridRecycleView: YaGridRecycleView = null;
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

        ya.button.addClick(this.btnVerticalPush.node, this.onClickPush, this);
        ya.button.addClick(this.btnVerticalInsert.node, this.onClickInsert, this);
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

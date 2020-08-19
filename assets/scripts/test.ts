import {lodash} from "./framework/libs/LibEntry";
import {YaRecycleView} from "./framework/components/recycle-view/YaRecycleView";
import {ya} from "./framework/ya";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Test extends cc.Component {
    @property(YaRecycleView) verticalRecycleView: YaRecycleView = null;
    @property(YaRecycleView) horizontalRecycleView: YaRecycleView = null;
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

        this.verticalRecycleView.bindData(data);
        this.horizontalRecycleView.bindData(lodash.clone(data));

        ya.button.addClick(this.btnVerticalPush.node, this.onClickPush, this);
        ya.button.addClick(this.btnVerticalInsert.node, this.onClickInsert, this);
    }

    private onClickPush() {
        this.verticalRecycleView.updateItem(30, this._totalCount, true);
        this.horizontalRecycleView.updateItem(30, this._totalCount++, true);
    }

    private onClickInsert() {
        const i = lodash.random(1, 5);
        this.verticalRecycleView.updateItem(i, this._totalCount, true);
        this.horizontalRecycleView.updateItem(i, this._totalCount++, true);
    }
}

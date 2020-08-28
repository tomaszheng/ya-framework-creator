import {YaRecycleView} from "./YaRecycleView";
import {lodash} from "../../libs/LibEntry";

class YaFlowRecycleView extends YaRecycleView {
    protected _flows: cc.Vec3[] = [];

    protected onLoad() {
        super.onLoad();

        const count = this._scrollView.vertical ? this.column : this.row;
        lodash.times(count, ()=>{
            this._flows.push(cc.v3());
        });
    }

    protected initTotalSize() {

    }

    protected calculateFirstItemPosition(node: cc.Node): cc.Vec3 {
        this._flows[0] = super.calculateFirstItemPosition(node);
        return this._flows[0];
    }

    protected calculateItemPosition(preIndex: number, index: number, node: cc.Node): cc.Vec3 {
        return cc.v3(0, 0, 0);
    }

    protected onItemChange(index: number, node: cc.Node, needAdjust: boolean) {

    }
}

export {YaFlowRecycleView};

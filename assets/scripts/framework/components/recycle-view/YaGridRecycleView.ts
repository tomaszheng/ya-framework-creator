import {YaRecycleView} from "./YaRecycleView";

const {ccclass, property} = cc._decorator;

@ccclass
class YaGridRecycleView extends YaRecycleView {
    @property({type: cc.Integer, min: 1}) gridWidth = 1;
    @property({type: cc.Integer, min: 1}) gridHeight = 1;
    @property({tooltip: '是否是流式布局'}) flow = false;

    protected calculateItemPosition(preIndex: number, index: number, node: cc.Node): cc.Vec3 {
        const size = node.getContentSize();
        const anchor = node.getAnchorPoint();

        const r = Math.floor(index / this.column);
        const c = index % this.row;

        let x = c * this.gridWidth * anchor.x + (this.gridWidth - size.width) * 0.5;
        let y = -r * this.gridHeight * (1 - anchor.y) - (this.gridHeight - size.height) * 0.5;
        if (c !== 0) x += this.gapX;
        if (r !== 0) y -= this.gapY;
        return cc.v3(x, y);
    }

}

export {YaGridRecycleView};

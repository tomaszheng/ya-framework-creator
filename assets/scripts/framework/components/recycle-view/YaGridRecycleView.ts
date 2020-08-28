import {YaRecycleView} from "./YaRecycleView";

const {ccclass, property} = cc._decorator;

@ccclass
class YaGridRecycleView extends YaRecycleView {
    @property({type: cc.Integer, min: 1}) gridWidth = 1;
    @property({type: cc.Integer, min: 1}) gridHeight = 1;

    protected initTotalSize() {
        this._totalSize.height = this._totalSize.width = 0;
        let r = 0;
        let c = 0;
        if (this._scrollView.vertical) {
            r = Math.floor(this._tailIndex / this.column) + 1;
            c = this._tailIndex + 1 >= this.column ? this.column : this._tailIndex + 1;
        } else {
            r = Math.floor(this._tailIndex / this.row) + 1;
            c = this._tailIndex + 1 >= this.row ? this.row : this._tailIndex + 1;
        }
        this._totalSize.height += r * this.gridHeight + (r - 1) * this.gapY;
        this._totalSize.width += c * this.gridWidth + (c - 1) * this.gapX;
    }

    protected updateRecord(index: number, item: cc.Node, size: cc.Size, x: number, y: number) {
        const record = {
            item,
            size: cc.size(this.gridWidth, this.gridHeight),
            x,
            y,
        };
        if (index < this._records.length) {
            this._records[index] = record;
        } else {
            this._records.push(record);
        }
    }

    protected calculateFirstItemPosition(node: cc.Node): cc.Vec3 {
        return this.calculateItemPosition(0, 0, node);
    }

    protected calculateItemPosition(preIndex: number, index: number, node: cc.Node): cc.Vec3 {
        const size = node.getContentSize();
        const anchor = node.getAnchorPoint();

        let r = 0;
        let c = 0;
        if (this._scrollView.vertical) {
            r = Math.floor(index / this.column);
            c = index % this.column;
        } else {
            r = index % this.row;
            c = Math.floor(index / this.row);
        }

        let x = (c + anchor.x) * this.gridWidth + (this.gridWidth - size.width) * 0.5;
        let y = -(r + 1 - anchor.y) * this.gridHeight  - (this.gridHeight - size.height) * 0.5;
        if (c !== 0) x += this.gapX * c;
        if (r !== 0) y -= this.gapY * r;

        return cc.v3(x, y, 0);
    }

    protected onItemChange(index: number, node: cc.Node, needAdjust: boolean) {
        const size = node.getContentSize();
        const oldItem = this._records[index];
        if (!oldItem) {
            if (this._scrollView.vertical) {
                if (index % this.column === 0) {
                    this._totalSize.height += this.gridHeight + (index > 0 ? this.gapY : 0);
                }
                if (index + 1 > this.column) {
                    this._totalSize.width = this.column * this.gridWidth;
                } else {
                    this._totalSize.width = (index + 1) * this.gridWidth;
                }
            } else {
                if (index % this.row === 0) {
                    this._totalSize.width += this.gridWidth + (index > 0 ? this.gapX : 0);
                }
                if (index + 1 > this.row) {
                    this._totalSize.height = this.row * this.gridHeight;
                } else {
                    this._totalSize.height = (index + 1) * this.gridHeight;
                }
            }
        }
        this.updateRecord(index, node, size, node.x, node.y);
    }
}

export {YaGridRecycleView};

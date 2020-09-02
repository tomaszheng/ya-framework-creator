/**
 * Grid无限列表
 * 1，支持横向；
 * 2，支持竖向；
 * 3，每个Grid大小必须固定；
 */
import {YaRecycleView} from "./YaRecycleView";

const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu('Recycle View/Grid')
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
            r = this._tailIndex + 1 >= this.row ? this.row : this._tailIndex + 1;
            c = Math.floor(this._tailIndex / this.row) + 1;
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

    protected doReuseRangeTail(startIndex: number, endIndex: number) {
        let i = startIndex <= this._tailIndex ? this._tailIndex + 1 : startIndex;
        for (; i < endIndex && i < this._data.length; i++) {
            this.doReuseAt(i - 1, i);
            this._tailIndex = i;
        }
    }

    protected reuseVerticalHead() {
        super.reuseVerticalHead();

        const r = Math.floor(this._headIndex / this.column);
        const startIndex = r * this.column;
        for (let i = this._headIndex - 1; i >= startIndex; i--) {
            this.doReuseAt(i + 1, i);
            this._headIndex = i;
        }
    }

    protected reuseVerticalTail() {
        const curRow = Math.floor(this._tailIndex / this.column);
        if (this.checkReuseVerticalTail(curRow)) {
            this.doReuseVerticalTail(curRow);
            this.doReuseVerticalTail(curRow + 1);
        } else if (curRow > 0) {
            const preRow = curRow - 1;
            if (this.checkReuseVerticalTail(preRow)) {
                this.doReuseVerticalTail(curRow);
            }
        }
    }

    protected checkReuseVerticalTail(rowIndex: number) {
        const startIndex = rowIndex * this.column;
        const record = this._records[startIndex];
        const offset = this._scrollView.getScrollOffset();
        const h = record.size.height * (1 - record.item.anchorY);
        return -this._size.height - record.y - h < offset.y;
    }

    protected doReuseVerticalTail(rowIndex: number) {
        const startIndex = rowIndex * this.column;
        const endIndex = (rowIndex + 1) * this.column;
        this.doReuseRangeTail(startIndex, endIndex);
    }

    protected reuseHorizontalHead() {
        super.reuseHorizontalHead();

        const c = Math.floor(this._headIndex / this.row);
        const startIndex = c * this.row;
        for (let i = this._headIndex - 1; i >= startIndex; i--) {
            this.doReuseAt(i + 1, i);
            this._headIndex = i;
        }
    }

    protected reuseHorizontalTail() {
        const curColumn = Math.floor(this._tailIndex / this.row);
        if (this.checkReuseHorizontalTail(curColumn)) {
            this.doReuseHorizontalTail(curColumn);
            this.doReuseHorizontalTail(curColumn + 1);
        } else if (curColumn > 0) {
            const preColumn = curColumn - 1;
            if (this.checkReuseHorizontalTail(preColumn)) {
                this.doReuseHorizontalTail(curColumn);
            }
        }
    }

    protected checkReuseHorizontalTail(rowIndex: number) {
        const startIndex = rowIndex * this.row;
        const record = this._records[startIndex];
        const offset = this._scrollView.getScrollOffset();
        return record.x - record.size.width * record.item.anchorX - this._size.width < -offset.x;
    }

    protected doReuseHorizontalTail(rowIndex: number) {
        const startIndex = rowIndex * this.row;
        const endIndex = (rowIndex + 1) * this.row;
        this.doReuseRangeTail(startIndex, endIndex);
    }
}

export {YaGridRecycleView};

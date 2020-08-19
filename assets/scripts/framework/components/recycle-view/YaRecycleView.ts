/**
 * 无限列表布局方式：
 * 1，支持竖向       √
 * 2，支持横向       √
 * 3，支持任意尺寸    x
 * 4，支持Grid      x
 * 5，支持流式       x
 * Item数据更新方式：
 * 1，尾部追加数据  √
 * 2，更新数据     √
 * 3，删除数据     ×
 * 4，中间插入数据  ×
 */
import {YaRecycleItem} from "./YaRecycleItem";
import {lodash} from "../../libs/LibEntry";
import {ya} from "../../ya";

interface IItemRecord {
    item: cc.Node;
    size: cc.Size;
    x: number;
    y: number;
}

enum ScrollDirection {
    NONE,
    TOP_TO_BOTTOM,
    BOTTOM_TO_TOP,
    LEFT_TO_RIGHT,
    RIGHT_TO_LEFT,
}

const {ccclass, property} = cc._decorator;

@ccclass
class YaRecycleView extends cc.Component {
    @property({type: cc.Integer, min: 1}) row = 1;
    @property({type: cc.Integer, min: 1}) column = 1;
    @property({type: cc.Integer, min: 1}) extra = 2;
    @property(cc.Integer) gapX = 10;
    @property(cc.Integer) gapY = 10;
    @property({tooltip: '是否是流式布局'}) flow = false;
    @property(cc.Prefab) itemPrefab: cc.Prefab = null;

    private _scrollView: cc.ScrollView = null;
    private _content: cc.Node = null;

    private _headIndex = -1;
    private _tailIndex = -1;
    private _middleIndex = -1;
    private _defaultCount = 1;

    private _data: any[] = [];
    private _records: IItemRecord[] = [];

    private _needRecycle = false;
    private _size: cc.Size = null;
    private _totalSize: cc.Size = cc.size(0, 0);
    private _preOffset: cc.Vec2 = cc.v2();
    private _scrollDirection: ScrollDirection = ScrollDirection.NONE;
    private _pool: cc.NodePool = null;
    private _createItemListener: () => cc.Node = null;

    public bindCreateItemListener(listener: () => cc.Node) {
        this._createItemListener = listener;
        return this;
    }

    public bindData(data: any[]) {
        for (let i = this._headIndex; i >= 0 && i <= this._tailIndex; i++) {
            this._pool.put(this._records[i].item);
        }

        this._data = data;
        this._records = [];
        this._headIndex = 0;
        this._tailIndex = (this._defaultCount >= this._data.length ? this._data.length : this._defaultCount) - 1;
        this._needRecycle = this._data.length > this._defaultCount;

        this.initItems();
        this.adjustContent();
        this.adjustItems();

        this.node.on('scrolling', this.onScroll, this);
    }

    public updateItem(index: number, itemData: any, needUpdate?: boolean) {
        if (index < 0) {
            index = this._data.length + index;
        }

        if (index >= this._data.length) {
            this._data.push(itemData);
            if (this._data.length <= this._defaultCount) {
                this.doReuseAt(this._tailIndex, ++this._tailIndex);
            }
        } else {
            this._data[index] = itemData;
        }
        this._needRecycle = this._data.length > this._defaultCount;

        if (needUpdate) {
            if (index >= this._headIndex && index <= this._tailIndex) {
                const item = this._records[index].item;
                item.getComponent(YaRecycleItem).updateData(itemData);
                if (index !== this._headIndex) {
                    item.position = this.calculateItemPosition(index - 1, index, item);
                } else {
                    item.position = this.calculateItemPosition(index + 1, index, item);
                }
                this.onItemChange(index, item, true);
            }
        }

        this.adjustContent();
        this.adjustItems();
    }

    public removeItem(index: number) {

    }

    public getItem(index: number): cc.Node {
        return this._records[index].item;
    }

    protected onLoad() {
        this._size = this.node.getContentSize();
        this._scrollView = this.node.getComponent(cc.ScrollView);
        this._content = this._scrollView.content;
        this._content.setAnchorPoint(cc.v2(0, 1));

        if (this._scrollView.vertical) {
            this._defaultCount = (this.row + this.extra) * this.column;
        } else {
            this._defaultCount = this.row * (this.column + this.extra);
        }

        this.initPool();
    }

    private initPool() {
        this._pool = new cc.NodePool(YaRecycleItem);
        lodash.times(this._defaultCount, () => {
            this._pool.put(this.createItem());
        });
    }

    private initItems() {
        this._totalSize.height = 0;
        lodash.times(this._tailIndex + 1, (i) => {
            const node = this._pool.get(this._data[i]);
            let position;
            if (i === 0) {
                position = this.calculateFirstItemPosition(node);
            } else {
                position = this.calculateItemPosition(i - 1, i, node);
            }
            node.parent = this._content;
            node.position = position;
            const size = node.getContentSize();
            this.updateRecord(this._records.length, node, size, position.x, position.y);

            this._totalSize.height += size.height;
            this._totalSize.width += size.width;
        });
        this._totalSize.width += (this._tailIndex - this._headIndex) * this.gapY;
        this._totalSize.height += (this._tailIndex - this._headIndex) * this.gapX;
    }

    private createItem() {
        let node;
        if (this._createItemListener) {
            node = this._createItemListener();
        } else {
            node = ya.uiHelper.instantiate(this.itemPrefab);
        }
        return node;
    }

    private updateRecord(index: number, item: cc.Node, size: cc.Size, x: number, y: number) {
        const record = {
            item,
            size,
            x,
            y,
        };
        if (index < this._records.length) {
            this._records[index] = record;
        } else {
            this._records.push(record);
        }
    }

    private calculateFirstItemPosition(node: cc.Node) {
        const size = node.getContentSize();
        const anchor = node.getAnchorPoint();

        if (this._scrollView.vertical) {
            const x = size.width * anchor.x;
            return cc.v3(x, size.height * (anchor.y - 1), 0);
        } else {
            const y = size.height * (anchor.y - 1);
            return cc.v3(size.width * anchor.x, y, 0);
        }
    }

    private calculateItemPosition(preIndex: number, index: number, node: cc.Node) {
        const size = node.getContentSize();
        const anchor = node.getAnchorPoint();
        const record = this._records[preIndex];

        let preX = record.x;
        let preY = record.y;
        if (this._scrollView.vertical) {
            if (index > preIndex) {
                preY -= record.size.height * record.item.anchorY;
                return cc.v3(size.width * anchor.x, preY - size.height * (1 - anchor.y) - this.gapY, 0);
            } else {
                preY += record.size.height * (1 - record.item.anchorY);
                return cc.v3(size.width * anchor.x, preY + size.height * anchor.y + this.gapY, 0);
            }
        } else {
            if (index > preIndex) {
                preX += record.size.width * (1 - record.item.anchorX);
                return cc.v3(preX + size.width * anchor.x + this.gapX, size.height * (anchor.y - 1), 0);
            } else {
                preX -= record.size.width * record.item.anchorX;
                return cc.v3(preX - size.width * (1 - anchor.x) - this.gapX, size.height * (anchor.y - 1), 0);
            }
        }
    }

    private getMiddleIndex() {
        return Math.floor((this._headIndex + this._tailIndex) / 2);
    }

    private onScroll() {
        if (!this._needRecycle) return;

        this.calculateScrollDirection();

        if (this.isStretching()) return;

        this._middleIndex = this.getMiddleIndex();

        this.recycle();

        this.reuse();

        this.adjustContent();

        this._preOffset = this._scrollView.getScrollOffset();
    }

    private isStretching(): boolean {
        switch (this._scrollDirection) {
            case ScrollDirection.BOTTOM_TO_TOP:
            case ScrollDirection.RIGHT_TO_LEFT: {
                return this._tailIndex === this._data.length - 1;
            }
            case ScrollDirection.TOP_TO_BOTTOM:
            case ScrollDirection.LEFT_TO_RIGHT: {
                return this._headIndex === 0;
            }
        }
    }

    private calculateScrollDirection() {
        this._scrollDirection = ScrollDirection.NONE;
        const offset = this._scrollView.getScrollOffset();
        if (this._scrollView.vertical) {
            if (offset.y > this._preOffset.y) {
                this._scrollDirection = ScrollDirection.BOTTOM_TO_TOP;
            } else if (offset.y < this._preOffset.y) {
                this._scrollDirection = ScrollDirection.TOP_TO_BOTTOM;
            }
        } else {
            if (offset.x < this._preOffset.x) {
                this._scrollDirection = ScrollDirection.RIGHT_TO_LEFT;
            } else {
                this._scrollDirection = ScrollDirection.LEFT_TO_RIGHT;
            }
        }
    }

    private recycle() {
        switch (this._scrollDirection) {
            case ScrollDirection.BOTTOM_TO_TOP: {
                this.recycleVerticalHead();
                break;
            }
            case ScrollDirection.TOP_TO_BOTTOM: {
                this.recycleVerticalTail();
                break;
            }
            case ScrollDirection.RIGHT_TO_LEFT: {
                this.recycleHorizontalHead();
                break;
            }
            case ScrollDirection.LEFT_TO_RIGHT: {
                this.recycleHorizontalTail();
                break;
            }
        }
    }

    private doRecycleAt(index) {
        const record = this._records[index];
        this._pool.put(record.item);
    }

    private recycleVerticalHead() {
        if (this._headIndex + 1 > this._tailIndex) return;

        const record = this._records[this._headIndex + 1];
        const offset = this._scrollView.getScrollOffset();
        if (record.size.height * (1 - record.item.anchorY) - record.y < offset.y) {
            this.doRecycleAt(this._headIndex++);
        }
    }

    private recycleVerticalTail() {
        if (this._tailIndex - 1 < this._headIndex) return;

        const record = this._records[this._tailIndex - 1];
        const offset = this._scrollView.getScrollOffset();
        if (-record.y - record.size.height * (1 - record.item.anchorY) - this._size.height > offset.y) {
            this.doRecycleAt(this._tailIndex--);
        }
    }

    private recycleHorizontalHead() {
        if (this._headIndex + 1 > this._tailIndex) return;

        const record = this._records[this._headIndex + 1];
        const offset = this._scrollView.getScrollOffset();
        if (record.size.width * (1 - record.item.anchorX) + record.x < -offset.x) {
            this.doRecycleAt(this._headIndex++);
        }
    }

    private recycleHorizontalTail() {
        if (this._tailIndex - 1 < this._headIndex) return;

        const record = this._records[this._tailIndex - 1];
        const offset = this._scrollView.getScrollOffset();
        if (record.x - record.size.width * record.item.anchorX - this._size.width > -offset.x) {
            this.doRecycleAt(this._tailIndex--);
        }
    }

    private onItemChange(index: number, node: cc.Node, needAdjust: boolean) {
        const size = node.getContentSize();
        const oldItem = this._records[index];
        const oldSize = !!oldItem ? oldItem.size.clone() : cc.size(-this.gapX, -this.gapY);
        const xOffset = size.width - oldSize.width;
        const yOffset = size.height - oldSize.height;

        this.updateRecord(index, node, size, node.x, node.y);

        if (this._scrollView.vertical) {
            this._totalSize.height += yOffset;
            if (needAdjust && !!oldItem && yOffset !== 0) {
                for (let i = index + 1; i <= this._tailIndex; i++) {
                    this._records[i].item.y -= yOffset;
                    this._records[i].y -= yOffset;
                }
            }
        } else {
            this._totalSize.width += xOffset;
            if (needAdjust && !!oldItem && xOffset !== 0) {
                for (let i = index + 1; i <= this._tailIndex; i++) {
                    this._records[i].item.x += xOffset;
                    this._records[i].x += xOffset;
                }
            }
        }
    }

    private reuse() {
        switch (this._scrollDirection) {
            case ScrollDirection.BOTTOM_TO_TOP: {
                this.reuseVerticalTail();
                break;
            }
            case ScrollDirection.TOP_TO_BOTTOM: {
                this.reuseVerticalHead();
                break;
            }
            case ScrollDirection.RIGHT_TO_LEFT: {
                this.reuseHorizontalTail();
                break;
            }
            case ScrollDirection.LEFT_TO_RIGHT: {
                this.reuseHorizontalHead();
                break;
            }
        }
    }

    private doReuseAt(preIndex: number, index: number) {
        const node = this._pool.get(this._data[index]);
        node.parent = this._content;
        node.position = this.calculateItemPosition(preIndex, index, node);

        this.onItemChange(index, node, false);
    }

    private reuseVerticalHead() {
        if (this._headIndex <= 0) return;

        const record = this._records[this._headIndex];
        const offset = this._scrollView.getScrollOffset();
        if (record.size.height - record.y > offset.y) {
            this.doReuseAt(this._headIndex, --this._headIndex);
        }
    }

    private reuseVerticalTail() {
        if (this._tailIndex + 1 >= this._data.length) return;

        const record = this._records[this._tailIndex];
        const offset = this._scrollView.getScrollOffset();
        if (-this._size.height - record.y < offset.y) {
            this.doReuseAt(this._tailIndex, ++this._tailIndex);
        }
    }

    private reuseHorizontalHead() {
        if (this._headIndex <= 0) return;

        const record = this._records[this._headIndex];
        const offset = this._scrollView.getScrollOffset();
        if (record.size.width * (1 - record.item.anchorX) + record.x > -offset.x) {
            this.doReuseAt(this._headIndex, --this._headIndex);
        }
    }

    private reuseHorizontalTail() {
        if (this._tailIndex + 1 >= this._data.length) return;

        const record = this._records[this._tailIndex];
        const offset = this._scrollView.getScrollOffset();
        if (record.x - record.size.width * record.item.anchorX - this._size.width < -offset.x) {
            this.doReuseAt(this._tailIndex, ++this._tailIndex);
        }
    }

    private adjustContent() {
        const middleItem = this._records[this._middleIndex];

        const width = Math.max(this._totalSize.width, this._size.width);
        const height = Math.max(this._totalSize.height, this._size.height);
        this._content.setContentSize(width, height);
    }

    private adjustItems() {
        const record = this._records[this._headIndex];
        if (this._scrollView.vertical && record.y > 0) {
            for (let i = this._headIndex; i <= this._tailIndex; i++) {
                this._records[i].y -= record.y;
                this._records[i].item.y -= record.y;
            }
        } else if(this._scrollView.horizontal && record.x < 0) {
            for (let i = this._headIndex; i <= this._tailIndex; i++) {
                this._records[i].x -= record.x;
                this._records[i].item.x -= record.x;
            }
        }
    }

    protected onDestroy() {
        this._pool.clear();
    }
}

export {YaRecycleView};

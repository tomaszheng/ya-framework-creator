/**
 * 无限列表布局方式：
 * 1，支持竖向       √
 * 2，支持横向       √
 * 3，支持任意尺寸    √
 * 4，支持Grid      x
 * 5，支持流式       x
 * Item数据更新方式：
 * 1，尾部追加数据  √
 * 2，更新数据     √
 * 3，删除数据     ×
 * 4，中间插入数据  ×
 * 操作方式：
 * 1，正常滑动     √
 * 2，scrollTo   ×
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
    @property({type: cc.Integer, min: 2}) extra = 2;
    @property({type: cc.Integer, min: 0}) gapX = 10;
    @property({type: cc.Integer, min: 0}) gapY = 10;
    @property({type: cc.Integer, min: 0}) paddingHead = 0;
    @property({type: cc.Integer, min: 0}) paddingTail = 0;
    @property(cc.Prefab) itemPrefab: cc.Prefab = null;

    protected _scrollView: cc.ScrollView = null;
    protected _content: cc.Node = null;

    protected _headIndex = -1;
    protected _tailIndex = -1;
    protected _defaultCount = 1;

    protected _data: any[] = [];
    protected _records: IItemRecord[] = [];

    protected _needRecycle = false;
    protected _size: cc.Size = null;
    protected _totalSize: cc.Size = cc.size(0, 0);
    protected _preScrollOffset: cc.Vec2 = cc.v2();
    protected _itemOffset: cc.Vec2 = cc.v2();
    protected _firstVisibleIndex = -1;
    protected _firstVisiblePosition = cc.v2();
    protected _scrollDirection: ScrollDirection = ScrollDirection.NONE;
    protected _pool: cc.NodePool = null;
    protected _createItemListener: () => cc.Node = null;

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
        this.adjustItems();
        this.adjustContent();

        this.node.on('scrolling', this.onScroll, this);
    }

    public updateItem(index: number, itemData: any) {
        this.calculateFirstVisibleItem();

        if (index < 0 || index >= this._data.length) {
            this._data.push(itemData);
            if (this._scrollView.vertical) {
                this.reuseVerticalTail();
            } else if (this._scrollView.horizontal) {
                this.reuseHorizontalTail();
            }
        } else {
            this._data[index] = itemData;
            if (index >= this._headIndex && index <= this._tailIndex) {
                const item = this._records[index].item;
                item.getComponent(YaRecycleItem).updateData(itemData);
                if (index !== this._headIndex) {
                    item.position = this.calculateItemPosition(index - 1, index, item);
                } else if (index !== this._tailIndex) {
                    item.position = this.calculateItemPosition(index + 1, index, item);
                } else {
                    item.position = this.calculateFirstItemPosition(item);
                }
                this.onItemChange(index, item, index !== this._headIndex);
            }
        }
        this._needRecycle = this._data.length > this._defaultCount;

        this.adjustItems();
        this.adjustContent();
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
        });

        this.initTotalSize();
    }

    private initTotalSize() {
        this._totalSize.height = this._totalSize.width = 0;
        lodash.times(this._tailIndex + 1, (i) => {
            const record = this._records[i];
            if (this._scrollView.vertical) {
                this._totalSize.height += record.size.height;
            } else {
                this._totalSize.width += record.size.width;
            }
        });
        if (this._scrollView.vertical) {
            this._totalSize.height += (this._tailIndex - this._headIndex) * this.gapX;
        } else {
            this._totalSize.width += (this._tailIndex - this._headIndex) * this.gapY;
        }
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

    private calculateFirstItemPosition(node: cc.Node): cc.Vec3 {
        const size = node.getContentSize();
        const anchor = node.getAnchorPoint();

        if (this._scrollView.vertical) {
            const x = size.width * anchor.x;
            const y = size.height * (anchor.y - 1) - this.paddingHead;
            return cc.v3(x, y, 0);
        } else {
            const x = size.width * anchor.x + this.paddingHead;
            const y = size.height * (anchor.y - 1);
            return cc.v3(x, y, 0);
        }
    }

    protected calculateItemPosition(preIndex: number, index: number, node: cc.Node): cc.Vec3 {
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

    private onScroll() {
        if (!this._needRecycle) return;

        this.calculateScrollDirection();

        if (this.isStretching()) return;

        this.calculateFirstVisibleItem();
        this.recycle();
        this.reuse();
        this.adjustItems();
        this.adjustContent();

        this._preScrollOffset = this._scrollView.getScrollOffset();
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
            if (offset.y > this._preScrollOffset.y) {
                this._scrollDirection = ScrollDirection.BOTTOM_TO_TOP;
            } else if (offset.y < this._preScrollOffset.y) {
                this._scrollDirection = ScrollDirection.TOP_TO_BOTTOM;
            }
        } else {
            if (offset.x < this._preScrollOffset.x) {
                this._scrollDirection = ScrollDirection.RIGHT_TO_LEFT;
            } else {
                this._scrollDirection = ScrollDirection.LEFT_TO_RIGHT;
            }
        }
    }

    private calculateFirstVisibleItem() {
        this._firstVisibleIndex = -1;
        const offset = this._scrollView.getScrollOffset();
        for (let i = this._headIndex; i <= this._tailIndex; i++) {
            const record = this._records[i];
            const x = record.x + record.size.width * (1 - record.item.anchorX) + offset.x;
            const y = record.y - record.size.height * record.item.anchorY + offset.y;
            if ((this._scrollView.vertical && y < 0) ||
                (this._scrollView.horizontal && x > 0)) {
                this._firstVisibleIndex = i;
                this._firstVisiblePosition = cc.v2(record.x, record.y);
                break;
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

    protected doRecycleAt(index) {
        const record = this._records[index];
        this._pool.put(record.item);
    }

    protected recycleVerticalHead() {
        const offset = this._scrollView.getScrollOffset();
        while (true) {
            const netherIndex = this._headIndex + this.column;
            if (netherIndex > this._tailIndex) return;
            const record = this._records[netherIndex];
            if (record.size.height * (1 - record.item.anchorY) - record.y < offset.y) {
                this.doRecycleAt(this._headIndex++);
            } else return;
        }
    }

    protected recycleVerticalTail() {
        const offset = this._scrollView.getScrollOffset();
        while (true) {
            const higherIndex = this._tailIndex - this.column;
            if (higherIndex < this._headIndex) return;
            const record = this._records[higherIndex];
            if (-record.y - record.size.height * (1 - record.item.anchorY) - this._size.height > offset.y) {
                this.doRecycleAt(this._tailIndex--);
            } else return;
        }
    }

    protected recycleHorizontalHead() {
        const offset = this._scrollView.getScrollOffset();
        while (true) {
            const rightIndex = this._headIndex + this.row;
            if (rightIndex > this._tailIndex) return;
            const record = this._records[rightIndex];
            if (record.size.width * (1 - record.item.anchorX) + record.x < -offset.x) {
                this.doRecycleAt(this._headIndex++);
            } else return;
        }
    }

    protected recycleHorizontalTail() {
        const offset = this._scrollView.getScrollOffset();
        while (true) {
            const leftIndex = this._tailIndex - this.row;
            if (leftIndex < this._headIndex) return;
            const record = this._records[leftIndex];
            if (record.x - record.size.width * record.item.anchorX - this._size.width > -offset.x) {
                this.doRecycleAt(this._tailIndex--);
            } else return;
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

    protected doReuseAt(preIndex: number, index: number) {
        const node = this._pool.get(this._data[index]);
        node.parent = this._content;
        if (preIndex === -1 && index === 0) {
            node.position = this.calculateFirstItemPosition(node);
        } else {
            node.position = this.calculateItemPosition(preIndex, index, node);
        }

        this.onItemChange(index, node, false);
    }

    protected reuseVerticalHead() {
        while (this._headIndex > 0) {
            const record = this._records[this._headIndex];
            const offset = this._scrollView.getScrollOffset();
            if (record.size.height - record.y > offset.y) {
                this.doReuseAt(this._headIndex, --this._headIndex);
            } else return;
        }
    }

    protected reuseVerticalTail() {
        while (this._tailIndex + 1 < this._data.length) {
            const record = this._records[this._tailIndex];
            const offset = this._scrollView.getScrollOffset();
            if (-this._size.height - record.y < offset.y) {
                this.doReuseAt(this._tailIndex, ++this._tailIndex);
            } else return;
        }
    }

    protected reuseHorizontalHead() {
        while (this._headIndex > 0) {
            const record = this._records[this._headIndex];
            const offset = this._scrollView.getScrollOffset();
            if (record.size.width * (1 - record.item.anchorX) + record.x > -offset.x) {
                this.doReuseAt(this._headIndex, --this._headIndex);
            } else return;
        }
    }

    protected reuseHorizontalTail() {
        while (this._tailIndex + 1 < this._data.length) {
            const record = this._records[this._tailIndex];
            const offset = this._scrollView.getScrollOffset();
            if (record.x - record.size.width * record.item.anchorX - this._size.width < -offset.x) {
                this.doReuseAt(this._tailIndex, ++this._tailIndex);
            } else return;
        }
    }

    private adjustContent() {
        let width = 0;
        let height = 0;
        if (this._scrollView.vertical) {
            height = this._totalSize.height + this.paddingHead + this.paddingTail;
        } else {
            width = this._totalSize.width + this.paddingHead + this.paddingTail;
        }
        width = Math.max(width, this._size.width);
        height = Math.max(height, this._size.height);
        this._content.setContentSize(width, height);

        const x = this._content.x + this._itemOffset.x;
        const y = this._content.y + this._itemOffset.y;
        this._scrollView.setContentPosition(cc.v2(x, y));
    }

    private adjustItems() {
        this.adjustHeadItems();
        this.adjustTailItems();

        if (this._firstVisibleIndex !== -1) {
            this._itemOffset.x = this._firstVisiblePosition.x - this._records[this._firstVisibleIndex].x;
            this._itemOffset.y = this._firstVisiblePosition.y - this._records[this._firstVisibleIndex].y;
        }
    }

    private adjustHeadItems() {
        const record = this._records[this._headIndex];
        const xOffset = record.x - record.size.width * record.item.anchorX;
        const yOffset = record.y + record.size.height * (1 - record.item.anchorY);
        if (this._scrollView.vertical && yOffset > 0) {
            this.setItemsOffset(0, yOffset);
        } else if (this._scrollView.horizontal && xOffset < 0) {
            this.setItemsOffset(xOffset, 0);
        }
    }

    private adjustTailItems() {
        if (this._tailIndex !== this._data.length - 1) return;

        const record = this._records[this._tailIndex];
        if (this._scrollView.vertical) {
            const bottomY = -record.y + record.size.height * record.item.anchorY;
            const yOffset = bottomY - this._totalSize.height - this.paddingHead;
            if (yOffset !== 0) {
                this.setItemsOffset(0, yOffset);
            }
        } else if (this._scrollView.horizontal) {
            const rightX = record.x + record.size.width * (1 - record.item.anchorX);
            const xOffset = rightX - this._totalSize.width - this.paddingHead;
            if (xOffset !== 0) {
                this.setItemsOffset(xOffset, 0);
            }
        }
    }

    private setItemsOffset(xOffset: number, yOffset: number) {
        for (let i = this._headIndex; i <= this._tailIndex; i++) {
            this._records[i].x -= xOffset;
            this._records[i].item.x -= xOffset;
            this._records[i].y -= yOffset;
            this._records[i].item.y -= yOffset;
        }
    }

    protected onDestroy() {
        this._pool.clear();
    }
}

export {YaRecycleView};

import {YaRecycleItem} from "./YaRecycleItem";
import {yaUIHelper} from "../../utils/ya-ui-helper";
import {lodash} from "../../libs/LibEntry";

interface IItemRecord {
    component: YaRecycleItem;
    size: cc.Size;
    recycled: boolean;
    position?: cc.Vec3;
}

enum ScrollDirection {
    NONE,
    TOP_TO_BOTTOM,
    BOTTOM_TO_TOP,
    LEFT_TO_RIGHT,
    RIGHT_TO_LEFT,
}

const LayoutAlignment = cc.Enum({
    TOP_TO_BOTTOM: 1,
    BOTTOM_TO_TOP: 2,
    LEFT_TO_RIGHT: 3,
    RIGHT_TO_LEFT: 4,
});

const {ccclass, property} = cc._decorator;

@ccclass
class YaRecycleView extends cc.Component {
    @property({type: cc.Integer, min: 1}) row = 1;
    @property({type: cc.Integer, min: 1}) column = 1;
    @property({type: cc.Integer, min: 1}) extra = 2;
    @property({tooltip: '是否是流式布局'}) flow = false;
    @property({type: LayoutAlignment}) alignment = LayoutAlignment.TOP_TO_BOTTOM;

    private _scrollView: cc.ScrollView = null;
    private _content: cc.Node = null;

    private _headIndex = -1;
    private _tailIndex = -1;

    private _data: any[] = [];
    private _items: IItemRecord[] = [];

    private _needRecycle = true;
    private _size: cc.Size = null;
    private _originalPosition: cc.Vec2 = null;
    private _preOffset: cc.Vec2 = null;
    private _scrollDirection: ScrollDirection;
    private _pool: cc.NodePool = null;

    protected onLoad() {
        this._scrollView = this.node.getComponent(cc.ScrollView);
        this._content = this._scrollView.content;

        this.node.on('scrolling', this.onScroll, this);

        lodash.times(50, (i) => {
            this._data.push('Label: ' + i);
        });
        this.initItems();

        this._needRecycle = true;
        this._scrollDirection = ScrollDirection.NONE;
        this._preOffset = cc.v2();
        this._originalPosition = this._content.getPosition();
        this._size = this.node.getContentSize();
        this._headIndex = 0;
        this._tailIndex = this.row + this.extra - 1;
        this._pool = new cc.NodePool(YaRecycleItem);
    }

    private initItems() {
        lodash.times(this.row + this.extra, (i) => {
            const node = new cc.Node();
            node.parent = this._content;
            node.anchorX = 0;
            node.anchorY = 1;
            node.color = cc.color(0, 0, 0);
            const component = node.addComponent(YaRecycleItem);
            const label = node.addComponent(cc.Label);
            label.string = this._data[i];
            label.fontSize = 16;

            const size = cc.size(135, 30);// node.getContentSize();
            const position = this.calItemPosition(i);
            this._items.push({
                component,
                size,
                position,
                recycled: false,
            });

            node.position = position;
        });
    }

    private calItemPosition(index: number) {
        if (this._scrollView.vertical) {
            return cc.v3(-110, -30 * index, 0);
        } else {
            return cc.v3(135 * index, 0, 0);
        }
    }

    private onScroll() {
        if (!this._needRecycle) return;

        this.calculateScrollDirection();

        if (this.isStretching()) return;

        this.recycle();

        this.reuse();

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
        const offset = this._scrollView.getScrollOffset();
        if (this._scrollView.vertical) {
            if (offset.y > this._preOffset.y) {
                this._scrollDirection = ScrollDirection.BOTTOM_TO_TOP;
            } else if (offset.y < this._preOffset.y) {
                this._scrollDirection = ScrollDirection.TOP_TO_BOTTOM;
            }
        } else {
            if (offset.x > this._preOffset.x) {
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

    // _headIndex已经看不见了，回收_headIndex
    private recycleVerticalHead() {
        const item = this._items[this._headIndex];
        const offset = this._scrollView.getScrollOffset();
        if (item.size.height - item.position.y < offset.y) {
            cc.log('==recycle-head- ', this._headIndex);
            this._pool.put(item.component.node);
            this._items[this._headIndex].recycled = true;
            this._headIndex++;
        }
    }

    // _tailIndex已经看不见了，回收_tailIndex
    private recycleVerticalTail() {
        const item = this._items[this._tailIndex];
        const offset = this._scrollView.getScrollOffset();
        if (-item.position.y - this._size.height > offset.y) {
            cc.log('==recycle-tail- ', this._tailIndex);
            this._pool.put(item.component.node);
            this._items[this._tailIndex].recycled = true;
            this._tailIndex--;
        }
    }

    // _headIndex + 1 已经看不见了，回收_headIndex
    private recycleHorizontalHead() {

    }

    // _tailIndex - 1已经看不见了，回收_tailIndex
    private recycleHorizontalTail() {
        if (this._tailIndex >= this._data.length) return;
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
        const preItem = this._items[preIndex];
        const position: cc.Vec3 = cc.v3();
        cc.Vec3.add(position, preItem.position, cc.v3(0, 30 * (index < preIndex ? 1 : -1)));

        const node = this._pool.get(this._data[index]);
        const size = node.getContentSize();
        node.parent = this._content;
        node.position = position;
        this._items[index] = {
            component: node.getComponent(YaRecycleItem),
            position,
            size,
            recycled: false,
        };
    }

    // _headIndex 已经看见了，重新使用_headIndex
    private reuseVerticalHead() {
        if (this._headIndex <= 0) return;

        const item = this._items[this._headIndex];
        const offset = this._scrollView.getScrollOffset();
        if (item.size.height - item.position.y > offset.y) {
            this.doReuseAt(this._headIndex, --this._headIndex);
        }
    }

    private reuseVerticalTail() {
        if (this._tailIndex + 1 >= this._data.length) return;

        const item = this._items[this._tailIndex];
        const offset = this._scrollView.getScrollOffset();
        if (-item.position.y - this._size.height < offset.y) {
            this.doReuseAt(this._tailIndex, ++this._tailIndex);
        }
    }

    private reuseHorizontalHead() {

    }

    private reuseHorizontalTail() {

    }

    protected onDestroy() {
        this._pool.clear();
    }
}

export {YaRecycleView};

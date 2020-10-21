import {RecycleItem} from "../../framework/components/recycle-view/RecycleItem";

const {ccclass, property} = cc._decorator;

@ccclass
class TestVerticalItem extends RecycleItem {
    @property(cc.Sprite) imgBg: cc.Sprite = null;
    @property(cc.Label) lblIndex: cc.Label = null;
    @property(cc.Label) lblContent: cc.Label = null;

    private _size: cc.Size = null;

    protected initUI() {
        this._size = this.node.getContentSize();
    }

    unuse() {
        super.unuse();
    }

    updateData(data: number) {
        this.lblIndex.string = String(data);
        this.lblContent.string = 'Str + ' + data;
        this.imgBg.node.color = cc.color(data % 2 === 1 ? 155 : 0, data % 2 === 1 ? 0 : 155, 0);

        const size = cc.size(this._size.width, this._size.height + (data > 10 ? 10 : data) * 10);
        this.imgBg.node.setContentSize(size);
        this.node.setContentSize(size);
    }
}

export {TestVerticalItem};

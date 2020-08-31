import {YaRecycleItem} from "../../framework/components/recycle-view/YaRecycleItem";

const {ccclass, property} = cc._decorator;

@ccclass
class TestHorizontalItem extends YaRecycleItem {
    @property(cc.Sprite) imgBg: cc.Sprite = null;
    @property(cc.Label) lblContent: cc.Label = null;

    private _size: cc.Size = null;

    protected initUI() {
        this._size = this.node.getContentSize();
    }

    updateData(data: number) {
        this.lblContent.string = '+' + data;
        this.imgBg.node.color = cc.color(data % 2 === 1 ? 155 : 0, data % 2 === 1 ? 0 : 155, 0);

        const size = cc.size(this._size.width + (data > 10 ? 10 : data) * 10, this._size.height);
        this.imgBg.node.setContentSize(size);
        this.node.setContentSize(size);
    }
}

export {TestHorizontalItem};

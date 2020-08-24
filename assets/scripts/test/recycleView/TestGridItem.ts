import {YaRecycleItem} from "../../framework/components/recycle-view/YaRecycleItem";

const {ccclass, property} = cc._decorator;

@ccclass
class TestGridItem extends YaRecycleItem {
    @property(cc.Sprite) imgBg: cc.Sprite = null;
    @property(cc.Label) lblContent: cc.Label = null;

    unuse() {
        super.unuse();
    }

    updateData(data: number) {
        this.lblContent.string = String(data);
        this.imgBg.node.color = cc.color(data % 2 === 1 ? 155 : 0, data % 2 === 1 ? 0 : 155, 0);
    }
}

export {TestGridItem};

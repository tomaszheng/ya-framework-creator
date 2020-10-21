import {RecycleItem} from "../../framework/components/recycle-view/RecycleItem";

const {ccclass, property} = cc._decorator;

@ccclass
class TestGridItem extends RecycleItem {
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

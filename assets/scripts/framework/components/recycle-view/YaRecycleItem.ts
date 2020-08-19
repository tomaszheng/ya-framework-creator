import {YaBaseComponent} from "../../base/YaBaseComponent";

const {ccclass, property} = cc._decorator;

@ccclass
class YaRecycleItem extends YaBaseComponent {
    public unuse() {

    }

    public reuse(data?: any) {
        this.updateData(data);
    }
}

export {YaRecycleItem};

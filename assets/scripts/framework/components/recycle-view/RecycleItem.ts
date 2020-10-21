import {BaseComponent} from "../../base/BaseComponent";

const {ccclass, property} = cc._decorator;

@ccclass
class RecycleItem extends BaseComponent {
    public unuse() {

    }

    public reuse(data?: any) {
        this.updateData(data);
    }
}

export {RecycleItem};

import {ya} from "../../framework/ya";
import {Toast} from "./sub-view/Toast";

const {ccclass, property} = cc._decorator;

@ccclass
class CommonView extends ya.View {

    poolToasts: cc.NodePool = null;

    protected initData(data?: any) {
        super.initData(data);
        this.poolToasts = new cc.NodePool();
    }

    showToast (params: any) {
        let node = null;
        let toast: Toast;
        if (this.poolToasts.size() > 0) {
            node = this.poolToasts.get();
            toast = node.getComponent("Toast");
        }
        else {
            node = new cc.Node();
            toast = node.addComponent(Toast);
        }

        toast.init();
        toast.reset(params);

        node.position = cc.v2(cc.winSize.width * 0.5, cc.winSize.height * 0.6);
        this.node.addChild(node);

        toast.show(()=>{
            this.poolToasts.put(node);
        });
    }
}

export {CommonView};

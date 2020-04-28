import ya from "../../Framework/ya";
import Toast from "./subviews/Toast";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GlobalView extends ya.View {

    poolToasts: cc.NodePool = null;

    onInitData () {
        this.poolToasts = new cc.NodePool();
    }

    showToast (params: any) {
        let node = null, script = null;
        if (this.poolToasts.size() > 0) {
            node = this.poolToasts.get();
            script = node.getComponent("Toast");
        }
        else {
            node = new cc.Node();
            script = node.addComponent(Toast);
        }

        script.reset(params);

        node.position = cc.v2(cc.winSize.width * 0.5, cc.winSize.height * 0.6);
        this.node.addChild(node);

        script.show(()=>{
            this.poolToasts.put(node);
        });
    }
}

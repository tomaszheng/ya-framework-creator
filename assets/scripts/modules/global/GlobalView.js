
let View = require("../../components/mvc/View");

let Toast = require("./subviews/Toast");

cc.Class({
    extends: View,

    properties: {

    },

    initData() {
        this.pool_toast = new cc.NodePool();
    },

    showToast(params) {
        let node, script;
        if (this.pool_toast.size() > 0) {
            node = this.pool_toast.get();
            script = node.getComponent("Toast");
        }
        else {
            node = new cc.Node();
            script = node.addComponent(Toast);
            script.init();
        }

        script.setData(params);

        node.position = cc.v2(cc.winSize.width*0.5, cc.winSize.height*0.6);
        this.node.addChild(node);

        script.show(()=>{
            this.pool_toast.put(node);
        });
    },

});

let _instance;

let LikePool = cc.Class({
    statics: {
        getInstance() {
            if (!_instance) {
                _instance = new LikePool();
            }
            return _instance;
        }
    },

    ctor() {
        this.pool = new cc.NodePool();
    },

    get(params) {
        params = params || {};
        let node, lbl, out;
        if (this.pool.size() > 0) {
            node = this.pool.get();
            lbl = node.getComponent(cc.Label);
            out = node.getComponent(cc.LabelOutline);
        }
        else {
            node = new cc.Node();
            lbl = node.addComponent(cc.Label);
            out = node.addComponent(cc.LabelOutline);
            lbl.fontSize = 60;
            lbl.lineHeight = 150;
            lbl.horizontalAlign = cc.macro.TextAlignment.CENTER;
            lbl.verticalAlign =cc.macro.TextAlignment.CENTER;
            out.color = cc.color(255, 255, 255);
            out.width = 5;
        }

        node.setRotation(0);
        lbl.color = params.color || cc.color(255, 0, 0);
        lbl.string = params.str || "";

        return node;
    },

    put(node) {
        if (!node) return;

        node.stopAllActions();

        this.pool.put(node);
    },

    run(node) {
        node.opacity = 0;
        node.position = cc.v2(0, cc.winSize.height*0.6);
        node.runAction(cc.sequence(
            cc.spawn(cc.moveBy(0.2, cc.v2(cc.winSize.width*0.5, 0)), cc.fadeIn(0.5)),
            cc.spawn(cc.moveBy(0.5, cc.v2(0, 150)), cc.sequence(cc.scaleTo(0.25, 1.1), cc.scaleTo(0.25, 1.0))),
            cc.fadeOut(0.2),
            cc.callFunc(()=>{
                this.put(node);
            })
        ));
    },
});
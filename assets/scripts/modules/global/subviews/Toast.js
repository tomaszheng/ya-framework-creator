
cc.Class({
    extends: cc.Component,

    init() {
        this.node.setContentSize(cc.size(600, 100));

        let img_bg = new cc.Node();
        let sprite = img_bg.addComponent(cc.Sprite);
        sprite.type = cc.Sprite.Type.SLICED;
        sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        sprite.spriteFrame = ya.rm.getSpriteFrame(ya.tex.game_cube_square);
        img_bg.color = cc.color(80, 80, 80);
        img_bg.setContentSize(cc.size(600, 50));
        this.node.addChild(img_bg);

        let node = new cc.Node();
        this.lbl_str = node.addComponent(cc.Label);
        this.lbl_str.fontSize = 25;
        this.lbl_str.lineHeight = 25;
        this.node.addChild(node);
    },

    setData(params) {
        let txt = params.txt;
        this.lbl_str.string = txt;
    },

    show(cb) {
        this.node.runAction(cc.sequence(
            cc.spawn(cc.fadeIn(0.5), cc.moveBy(0.5, cc.v2(0, 50))), 
            cc.delayTime(1.8), 
            cc.fadeOut(0.2), 
            cc.callFunc(()=>{
                cb && cb();
            })
        ));
    }
});
import ya from "../../../framework/ya";
import SpriteFrameConfig from "../../../config/resource/SpriteFrameConfig";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Toast extends cc.Component {

    lblContent: cc.Label = null;

    init () {
        this.node.setContentSize(cc.size(600, 100));

        let imgBg = new cc.Node();
        let sprite = imgBg.addComponent(cc.Sprite);
        sprite.type = cc.Sprite.Type.SLICED;
        sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        sprite.spriteFrame = ya.resourceManager.getSpriteFrame(SpriteFrameConfig.game_cube_square);
        imgBg.color = cc.color(80, 80, 80);
        imgBg.setContentSize(cc.size(600, 50));
        this.node.addChild(imgBg);

        let node = new cc.Node();
        this.lblContent = node.addComponent(cc.Label);
        this.lblContent.fontSize = 25;
        this.lblContent.lineHeight = 25;
        this.node.addChild(node);
    }

    reset (params: any) {
        let txt = params.txt;
        this.lblContent.string = txt;
    }

    show (callback: Function) {
        this.node.opacity = 0;
        cc.tween(this.node)
            .parallel(
                cc.tween().to(0.5, {opacity: 255}),
                cc.tween().by(0.5, {position: cc.v2(0, 50)})
            )
            .delay(1.8)
            .to(0.2, {opacity: 0})
            .call(() => {
                ya.utils.doCallback(callback);
            });
    }
}

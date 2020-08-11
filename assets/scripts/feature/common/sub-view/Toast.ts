import {ya} from "../../../framework/ya";
import {SpriteFrameConfig} from "../../../config/resource/SpriteFrameConfig";

const {ccclass} = cc._decorator;

@ccclass
class Toast extends ya.BaseComponent {

    lblContent: cc.Label = null;

    protected initUI() {
        super.initUI();

        this.node.setContentSize(cc.size(600, 100));

        const imgBg = new cc.Node();
        const sprite = imgBg.addComponent(cc.Sprite);
        sprite.type = cc.Sprite.Type.SLICED;
        sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        sprite.spriteFrame = ya.resourceManager.getSpriteFrame(SpriteFrameConfig.game_cube_square);
        imgBg.color = cc.color(80, 80, 80);
        imgBg.setContentSize(cc.size(600, 50));
        this.node.addChild(imgBg);

        const node = new cc.Node();
        this.lblContent = node.addComponent(cc.Label);
        this.lblContent.fontSize = 25;
        this.lblContent.lineHeight = 25;
        this.node.addChild(node);
    }

    reset(params: any) {
        this.lblContent.string = params.txt;
    }

    show(callback: () => void) {
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

export {Toast};
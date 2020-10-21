import {SpriteFrameConfig} from "../../../config/resource/SpriteFrameConfig";
import {BaseComponent} from "../../../framework/base/BaseComponent";
import {resourceManager} from "../../../framework/manager/ResourceManager";
import {utils} from "../../../framework/utils/Utils";

const {ccclass} = cc._decorator;

@ccclass
class Toast extends BaseComponent {
    private _lblContent: cc.Label = null;

    protected initUI() {
        super.initUI();

        this.node.setContentSize(cc.size(600, 100));

        const imgBg = new cc.Node();
        const sprite = imgBg.addComponent(cc.Sprite);
        sprite.type = cc.Sprite.Type.SLICED;
        sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        sprite.spriteFrame = resourceManager.getSpriteFrame(SpriteFrameConfig.game_cube_square);
        imgBg.color = cc.color(80, 80, 80);
        imgBg.setContentSize(cc.size(600, 50));
        this.node.addChild(imgBg);

        const node = new cc.Node();
        this._lblContent = node.addComponent(cc.Label);
        this._lblContent.fontSize = 25;
        this._lblContent.lineHeight = 25;
        this.node.addChild(node);
    }

    reset(params: any) {
        this._lblContent.string = params.txt;
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
                utils.doCallback(callback);
            });
    }
}

export {Toast};

import Item from "../../widget/Item";
import {GameConstant} from "../../config/GameConstant";
import {ya} from "../../framework/ya";
import {GameText} from "../../config/GameText";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ItemView extends ya.Dialog {
    @property(cc.Node) ndItem: cc.Node = null;

    @property(cc.Node) lblContent: cc.Node = null;

    @property(cc.Node) btnNormal: cc.Node = null;

    @property(cc.Node) btnDouble: cc.Node = null;

    gotMode = -1;
    normalCallback: () => void = null;
    doubleCallback: () => void = null;
    content = "";
    items: any = [];

    protected initData(data?: any) {
        super.initData(data);

        this.gotMode = data.got_mode;
        this.normalCallback = data.normal_cb;
        this.doubleCallback = data.double_cb;
        this.content = data.content;
        this.items = data.items;
    }

    protected initUI() {
        super.initUI();

        let x = -0.5 * (this.items.length - 1) * 150;
        for (let i = 0, item; i < this.items.length; i++) {
            item = new Item();
            item.init(this.items[i]);
            item.x = x;
            this.node.addChild(item);
            x += 150;
        }

        this.btnNormal.active = false;

        let dobuleStr = "";
        if (this.gotMode === GameConstant.REVIVE_MODE.NONE ||
            this.gotMode === GameConstant.REVIVE_MODE.FREE) {
            dobuleStr = GameText.str_019;
        } else if (this.gotMode === GameConstant.REVIVE_MODE.SHARE) {
            dobuleStr = GameText.str_022;
        } else if (this.gotMode === GameConstant.REVIVE_MODE.VIDEO) {
            dobuleStr = GameText.str_023;
        }
        this.btnDouble.getChildByName("Label").getComponent(cc.Label).string = dobuleStr;

        this.lblContent.getComponent(cc.Label).string = this.content;
    }

    protected initTouchEvent() {
        super.initTouchEvent();

        ya.button.addClick(this.btnNormal, () => {
            this.removeSelf();
            if (this.normalCallback) this.normalCallback();
        });

        ya.button.addClick(this.btnDouble, () => {
            this.onClickDouble();
        });
    }

    onClickDouble() {
        if (this.gotMode === GameConstant.REVIVE_MODE.SHARE) {
            // ya.platform.share({
            //     title: GameText.share_title_common,
            //     imageUrl: ya.res.share_common_img,
            //     cb: (code)=>{
            //         if (code === 0) {
            //             this.removeSelf();
            //             this.double_cb && this.double_cb();
            //         }
            //     }
            // });
        } else if (this.gotMode === GameConstant.REVIVE_MODE.VIDEO) {
            // ya.platform.showVideoAd((is_ended)=>{
            //     if (is_ended) {
            //         this.removeSelf();
            //         this.double_cb && this.double_cb();
            //     }
            // });
        } else if (this.gotMode === GameConstant.REVIVE_MODE.NONE ||
            this.gotMode === GameConstant.REVIVE_MODE.FREE) {
            this.removeSelf();
            if (this.normalCallback) this.normalCallback();
        }
    }
}

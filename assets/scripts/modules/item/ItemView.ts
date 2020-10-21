import Item from "../../widget/Item";
import {GameConstant} from "../../config/GameConstant";
import {GameText} from "../../config/GameText";
import {BaseDialog} from "../../framework/mvc/BaseDialog";
import {buttonHelper} from "../../framework/utils/ButtonHelper";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ItemView extends BaseDialog {
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

        let doubleStr = "";
        if (this.gotMode === GameConstant.REVIVE_MODE.NONE ||
            this.gotMode === GameConstant.REVIVE_MODE.FREE) {
            doubleStr = GameText.str_019;
        } else if (this.gotMode === GameConstant.REVIVE_MODE.SHARE) {
            doubleStr = GameText.str_022;
        } else if (this.gotMode === GameConstant.REVIVE_MODE.VIDEO) {
            doubleStr = GameText.str_023;
        }
        this.btnDouble.getChildByName("Label").getComponent(cc.Label).string = doubleStr;

        this.lblContent.getComponent(cc.Label).string = this.content;
    }

    protected initTouchEvent() {
        super.initTouchEvent();

        buttonHelper.addClick(this.btnNormal, () => {
            this.removeSelf();
            if (this.normalCallback) this.normalCallback();
        }, this);

        buttonHelper.addClick(this.btnDouble, () => {
            this.onClickDouble();
        }, this);
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

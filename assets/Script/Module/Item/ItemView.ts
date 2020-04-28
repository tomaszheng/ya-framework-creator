import ya from "../../Framework/ya";
import GameConstant from "../../Config/GameConstant";
import GameText from "../../Config/GameText";
import Item from "../../Widget/Item";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ItemView extends ya.Dialog {
    @property(cc.Node)
    nd_item: cc.Node = null;

    @property(cc.Node)
    lbl_content: cc.Node = null;

    @property(cc.Node)
    btn_normal: cc.Node = null;

    @property(cc.Node)
    btn_double: cc.Node = null;

    got_mode: number = -1;
    normal_cb: Function = null;
    double_cb: Function = null;
    content: string = "";
    items: any = [];

    onInitData (data: any) {
        this.got_mode = data.got_mode;
        this.normal_cb = data.normal_cb;
        this.double_cb = data.double_cb;
        this.content = data.content;
        this.items = data.items;
    }

    onInitUI () {
        let x = -0.5 * (this.items.length - 1) * 150;
        for (let i = 0, item; i < this.items.length; i++) {
            item = new Item();
            item.init(this.items[i]);
            item.x = x;
            this.node.addChild(item);
            x += 150;
        }

        this.btn_normal.active = false;

        let dobule_str = "";
        if (this.got_mode === GameConstant.REVIVE_MODE.NONE ||
            this.got_mode === GameConstant.REVIVE_MODE.FREE)
        {
            dobule_str = GameText.str_019;
        }
        else if (this.got_mode === GameConstant.REVIVE_MODE.SHARE) {
            dobule_str = GameText.str_022;
        }
        else if (this.got_mode === GameConstant.REVIVE_MODE.VIDEO) {
            dobule_str = GameText.str_023;
        }
        this.btn_double.getChildByName("Label").getComponent(cc.Label).string = dobule_str;

        this.lbl_content.getComponent(cc.Label).string = this.content;
    }

    onInitClick () {
        ya.utils.addClickEvent(this.btn_normal, ()=>{
            this.removeSelf();
            this.normal_cb && this.normal_cb();
        });

        ya.utils.addClickEvent(this.btn_double, ()=>{
            this.onClickDouble();
        });
    }

    onClickDouble() {
        if (this.got_mode === GameConstant.REVIVE_MODE.SHARE) {
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
        }
        else if (this.got_mode === GameConstant.REVIVE_MODE.VIDEO) {
            // ya.platform.showVideoAd((is_ended)=>{
            //     if (is_ended) {
            //         this.removeSelf();
            //         this.double_cb && this.double_cb();
            //     }
            // });
        }
        else if (this.got_mode === GameConstant.REVIVE_MODE.NONE ||
            this.got_mode === GameConstant.REVIVE_MODE.FREE)
        {
            this.removeSelf();
            this.normal_cb && this.normal_cb();
        }
    }
}

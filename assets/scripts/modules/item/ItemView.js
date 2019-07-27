let Dialog = require("../../components/mvc/Dialog");

let Item = require("../../widgets/Item");

cc.Class({
    extends: Dialog,

    properties: {
        nd_item: cc.Node,
        lbl_content: cc.Node,

        btn_normal: cc.Node,
        btn_double: cc.Node,
    },

    initData(params) {
        this._super(params);

        let d = this.init_data;
        this.got_mode = d.got_mode;
        this.normal_cb = d.normal_cb;
        this.double_cb = d.double_cb;
        this.content = d.content;
        this.items = d.items;
    },

    initUI() {
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
        if (this.got_mode === ya.const.REVIVE_MODE.NONE ||
            this.got_mode === ya.const.REVIVE_MODE.FREE)
        {
            dobule_str = ya.txt.str_019;
        }
        else if (this.got_mode === ya.const.REVIVE_MODE.SHARE) {
            dobule_str = ya.txt.str_022;
        }
        else if (this.got_mode === ya.const.REVIVE_MODE.VIDEO) {
            dobule_str = ya.txt.str_023;
        }
        this.btn_double.getChildByName("Label").getComponent(cc.Label).string = dobule_str;

        this.lbl_content.getComponent(cc.Label).string = this.content;
    },

    initEvent() {

    },

    initClick() {
        ya.utils.addClickEvent(this.btn_normal, ()=>{
            this.removeSelf();
            this.normal_cb && this.normal_cb();
        });

        ya.utils.addClickEvent(this.btn_double, ()=>{
            this.onClickDouble();
        });
    },

    onClickDouble() {
        if (this.got_mode === ya.const.REVIVE_MODE.SHARE) {
            ya.platform.share({
                title: ya.txt.share_title_common,
                imageUrl: ya.res.share_common_img,
                cb: (code)=>{
                    if (code === 0) {
                        this.removeSelf();
                        this.double_cb && this.double_cb();
                    }
                }
            });
        }
        else if (this.got_mode === ya.const.REVIVE_MODE.VIDEO) {
            ya.platform.showVideoAd((is_ended)=>{
                if (is_ended) {
                    this.removeSelf();
                    this.double_cb && this.double_cb();
                }
            });
        }
        else if (this.got_mode === ya.const.REVIVE_MODE.NONE ||
            this.got_mode === ya.const.REVIVE_MODE.FREE)
        {
            this.removeSelf();
            this.normal_cb && this.normal_cb();
        }
    },
});
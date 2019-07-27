
let Dialog = require("../../components/mvc/Dialog");

cc.Class({
    extends: Dialog,

    properties: {
        lbl_tip: cc.Label,

        lbl_revive_txt: cc.Label,
    },

    initData(params) {
        this._super(params);

        let d = this.init_data;
        this.mode = d.mode;
        this.score = d.score;
        this.revive_num = d.revive_num;
        this.total_num = d.total_num;
        this.success_cb = d.success_cb;
        this.fail_cb = d.fail_cb;
    },

    initUI() {
        ya.music.playEffect(ya.res.sound_die);
        
        let str = cc.js.formatStr(ya.txt.str_004, this.revive_num, this.total_num);

        this.lbl_tip.string = str;

        if (this.mode === ya.const.REVIVE_MODE.FREE) {
            this.lbl_revive_txt.string = ya.txt.str_001;
        }
        else if (this.mode === ya.const.REVIVE_MODE.SHARE) {
            this.lbl_revive_txt.string = ya.txt.str_002;
        }
        else if (this.mode === ya.const.REVIVE_MODE.VIDEO) {
            this.lbl_revive_txt.string = ya.txt.str_003;
        }
    },

    initEvent() {

    },

    onClickClose() {
        this.fail_cb && this.fail_cb();

        this.removeSelf();
    },

    onClickSpace() {
        // this.onClickClose();
    },

    onClickRevive() {
        if (this.mode === ya.const.REVIVE_MODE.FREE) {
            this.reviveSuccess();
        }
        else if (this.mode === ya.const.REVIVE_MODE.SHARE) {
            ya.platform.share({
                title: cc.js.formatStr(ya.txt.share_title_revive, this.score),
                imageUrl: ya.res.image_share_revive,
                cb: (code, res)=>{
                    if (code === 0) {
                        this.reviveSuccess();
                    }
                }
            });
        }
        else if (this.mode === ya.const.REVIVE_MODE.VIDEO) {
            ya.platform.showVideoAd((is_ended)=>{
                if (is_ended) {
                    this.reviveSuccess();
                }
            });
        }
    },

    reviveSuccess() {
        this.success_cb && this.success_cb();

        this.removeSelf();
    },
});

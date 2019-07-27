
let Dialog = require("../../components/mvc/Dialog");

cc.Class({
    extends: Dialog,

    properties: {
        lbl_cur_score: cc.Label,

        img_rank: cc.Node,

        btn_close: cc.Node,
        btn_share: cc.Node,
        btn_main: cc.Node,
        btn_restart: cc.Node,
    },

    initData(params) {
        this._super(params);
        
        let d = this.init_data;
        this.mode = d.mode;
        this.score = d.score;

        this.restart_cb = d.restart_cb;
        this.main_cb = d.main_cb;
        
        this.view_width = 580;
        this.view_height = 220;

        this.is_support_wx = CC_WECHATGAME && (!!(window['wx'] && window['wx'].getOpenDataContext));
    },

    initUI() {
        this.lbl_cur_score.string = this.score.toString();

        let action = 0;
        if (this.mode === ya.const.GAME_MODE.STAR) {
            action = ya.const.WX.AC_F_STAR_SETTLE;
        }
        else if (this.mode === ya.const.GAME_MODE.RUSSIA) {
            action = ya.const.WX.AC_F_RUSSIA_SETTLE;
        }
        else if (this.mode === ya.const.GAME_MODE.UNION) {
            action = ya.const.WX.AC_F_UNION_SETTLE;
        }

        if (this.is_support_wx) {
            let canvas = wx.getOpenDataContext().canvas;
            canvas.width = this.view_width;
            canvas.height = this.view_height;

            this._wx_tex = new cc.Texture2D();
            this._wx_spriteframe = new cc.SpriteFrame();

            window['wx'].getOpenDataContext().postMessage({ action: action });
        }
    },

    initClick() {
        ya.utils.addClickEvent(this.btn_close, ()=>{
            this.onClickClose();
        });
        ya.utils.addClickEvent(this.btn_share, ()=>{
            this.onClickShare();
        });
        ya.utils.addClickEvent(this.btn_main, ()=>{
            this.onClickMain();
        });
        ya.utils.addClickEvent(this.btn_restart, ()=>{
            this.onClickRestart();
        });
    },

    update(dt) {
        if (this.is_support_wx) {
            this._wx_tex.initWithElement(window['wx'].getOpenDataContext().canvas);
            this._wx_tex.handleLoadedTexture();
            this._wx_spriteframe.setTexture(this._wx_tex);
            this.img_rank.getComponent(cc.Sprite).spriteFrame = this._wx_spriteframe;
        }
    },

    onClickSpace() {
        // this.onClickClose();
    },

    onClickClose() {
        this.removeSelf();

        ya.mm.show("main", null, true);
    },

    onClickShare() {
        let title = "", str = "";
        if (this.mode === ya.const.GAME_MODE.STAR) {
            str = ya.txt.mode_001;
        }
        else if (this.mode === ya.const.GAME_MODE.RUSSIA) {
            str = ya.txt.mode_002;
        }
        else if (this.mode === ya.const.GAME_MODE.UNION) {
            str = ya.txt.mode_003;
        }
        title = cc.js.formatStr(ya.txt.share_title_settle, str, this.score);
        ya.platform.share({
            title: title,
            imageUrl: ya.res.image_share_settle
        });
    },

    onClickRestart() {
        this.removeSelf();

        this.restart_cb && this.restart_cb();
    },

    onClickMain() {
        this.removeSelf();

        this.main_cb && this.main_cb();
    },
});
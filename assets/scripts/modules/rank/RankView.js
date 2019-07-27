
let View = require("../../components/mvc/View");

cc.Class({
    extends: View,

    properties: {
        nd_rank: cc.Node,
        img_rank: cc.Node,

        btn_star: cc.Node,
        btn_union: cc.Node,
        btn_russia: cc.Node,
    },

    initData(params) {
        this._super(params);

        let d = this.init_data || {};
        this.mode = d.mode || ya.const.GAME_MODE.STAR;

        this.view_width = 500;
        this.view_height = 790;

        this.is_support_wx = CC_WECHATGAME && (!!(window['wx'] && window['wx'].getOpenDataContext));
    },

    initUI() {
        let action = 0;
        if (this.mode === ya.const.GAME_MODE.STAR) {
            action = ya.const.WX.AC_F_STAR_FETCH;
        }
        else if (this.mode === ya.const.GAME_MODE.UNION) {
            action = ya.const.WX.AC_F_UNION_FETCH;
        }
        else if (this.mode === ya.const.GAME_MODE.RUSSIA) {
            action = ya.const.WX.AC_F_RUSSIA_FETCH;
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

    initEvent() {

    },

    initClick() {
        if (this.is_support_wx) {
            this.nd_rank.on(cc.Node.EventType.TOUCH_MOVE, (event) => {
                this.onMove(event);
            }, this);
        }

        ya.utils.addClickEvent(this.btn_star, ()=>{
            this.onClickStar();
        });
        ya.utils.addClickEvent(this.btn_union, ()=>{
            this.onClickUnion();
        });
        ya.utils.addClickEvent(this.btn_russia, ()=>{
            this.onClickRussia();
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

    onMove(event) {
        let touch = event.touch;
        let curp = touch.getLocation();
        let prep = touch.getPreviousLocation();

        let action = ya.const.WX.AC_SCROLL_V;
        if (this.is_support_wx) {
            window['wx'].getOpenDataContext().postMessage({ action: action, offsety: curp.y - prep.y });
        }
    },

    onClickClose() {
        ya.mm.show("main", null, true);
    },

    onClickStar() {
        if (this.mode === ya.const.GAME_MODE.STAR) return;

        this.mode = ya.const.GAME_MODE.STAR;

        if (this.is_support_wx) {
            window['wx'].getOpenDataContext().postMessage({ action: ya.const.WX.AC_F_STAR_FETCH });
        }
    },
    onClickUnion() {
        if (this.mode === ya.const.GAME_MODE.UNION) return;

        this.mode = ya.const.GAME_MODE.UNION;

        if (this.is_support_wx) {
            window['wx'].getOpenDataContext().postMessage({ action: ya.const.WX.AC_F_UNION_FETCH });
        }
    },

    onClickRussia() {
        if (this.mode === ya.const.GAME_MODE.RUSSIA) return;

        this.mode = ya.const.GAME_MODE.RUSSIA;

        if (this.is_support_wx) {
            window['wx'].getOpenDataContext().postMessage({ action: ya.const.WX.AC_F_RUSSIA_FETCH });
        }
    },

});

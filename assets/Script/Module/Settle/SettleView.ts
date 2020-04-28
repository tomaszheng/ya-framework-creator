import ya from "../../Framework/ya";
import GameConstant from "../../Config/GameConstant";
import GameText from "../../Config/GameText";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SettleView extends ya.Dialog {
    @property(cc.Label)
    lbl_cur_score: cc.Label = null;

    @property(cc.Node)
    img_rank: cc.Node = null;

    @property(cc.Node)
    btn_close: cc.Node = null;

    @property(cc.Node)
    btn_share: cc.Node = null;

    @property(cc.Node)
    btn_main: cc.Node = null;

    @property(cc.Node)
    btn_restart: cc.Node = null;

    mode: number = -1;
    score: number = -1;
    restart_cb: Function = null;
    main_cb: Function = null;

    view_width: number = 580;
    view_height: number = 220;

    is_support_wx: boolean = false;

    _wx_tex: cc.Texture2D = null;
    _wx_spriteframe: cc.SpriteFrame = null;
    
    onInitData (data: any) {
        this.mode = data.mode;
        this.score = data.score;

        this.restart_cb = data.restart_cb;
        this.main_cb = data.main_cb;

        this.is_support_wx = CC_WECHATGAME && (!!(window['wx'] && window['wx'].getOpenDataContext));
    }

    onInitUI () {
        this.lbl_cur_score.string = this.score.toString();

        let action = 0;
        if (this.mode === GameConstant.GAME_MODE.STAR) {
            action = GameConstant.WX.AC_F_STAR_SETTLE;
        }
        else if (this.mode === GameConstant.GAME_MODE.RUSSIA) {
            action = GameConstant.WX.AC_F_RUSSIA_SETTLE;
        }
        else if (this.mode === GameConstant.GAME_MODE.UNION) {
            action = GameConstant.WX.AC_F_UNION_SETTLE;
        }

        if (this.is_support_wx) {
            let canvas = window['wx'].getOpenDataContext().canvas;
            canvas.width = this.view_width;
            canvas.height = this.view_height;

            this._wx_tex = new cc.Texture2D();
            this._wx_spriteframe = new cc.SpriteFrame();

            window['wx'].getOpenDataContext().postMessage({ action: action });
        }
    }

    onInitClick () {
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
    }

    update (dt: number) {
        if (this.is_support_wx) {
            this._wx_tex.initWithElement(window['wx'].getOpenDataContext().canvas);
            this._wx_tex.handleLoadedTexture();
            this._wx_spriteframe.setTexture(this._wx_tex);
            this.img_rank.getComponent(cc.Sprite).spriteFrame = this._wx_spriteframe;
        }
    }

    onClickSpace () {
        // this.onClickClose();
    }

    onClickClose () {
        this.removeSelf();

        ya.viewManager.show("main", null, true);
    }

    onClickShare () {
        let title = "", str = "";
        if (this.mode === GameConstant.GAME_MODE.STAR) {
            str = GameText.mode_001;
        }
        else if (this.mode === GameConstant.GAME_MODE.RUSSIA) {
            str = GameText.mode_002;
        }
        else if (this.mode === GameConstant.GAME_MODE.UNION) {
            str = GameText.mode_003;
        }
        title = cc.js.formatStr(GameText.share_title_settle, str, this.score);
        // ya.platform.share({
        //     title: title,
        //     imageUrl: ya.res.image_share_settle
        // });
    }

    onClickRestart () {
        this.removeSelf();

        this.restart_cb && this.restart_cb();
    }

    onClickMain () {
        this.removeSelf();

        this.main_cb && this.main_cb();
    }
}

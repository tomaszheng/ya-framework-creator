import {GameConstant} from "../../config/GameConstant";
import {ya} from "../../framework/ya";
import {GameText} from "../../config/GameText";

const {ccclass, property} = cc._decorator;

@ccclass
class SettleView extends ya.Dialog {
    @property(cc.Label) lblCurScore: cc.Label = null;
    @property(cc.Node) imgRank: cc.Node = null;
    @property(cc.Node) btnClose: cc.Node = null;
    @property(cc.Node) btnShare: cc.Node = null;
    @property(cc.Node) btnMain: cc.Node = null;
    @property(cc.Node) btnRestart: cc.Node = null;

    mode = -1;
    score = -1;
    restartCb: ()=>void = null;
    mainCb: ()=>void = null;

    viewWidth = 580;
    viewHeight = 220;

    isSupportWx = false;

    _wxTex: cc.Texture2D = null;
    _wxSpriteFrame: cc.SpriteFrame = null;

    protected initData(data?: any) {
        super.initData(data);

        this.mode = data.mode;
        this.score = data.score;

        this.restartCb = data.restart_cb;
        this.mainCb = data.main_cb;

        const wx = 'wx';
        this.isSupportWx = CC_WECHATGAME && (!!(window[wx] && window[wx].getOpenDataContext));
    }

    protected initUI() {
        super.initUI();

        this.lblCurScore.string = this.score.toString();

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

        const wx = 'wx';
        if (this.isSupportWx) {
            const canvas = window[wx].getOpenDataContext().canvas;
            canvas.width = this.viewWidth;
            canvas.height = this.viewHeight;

            this._wxTex = new cc.Texture2D();
            this._wxSpriteFrame = new cc.SpriteFrame();

            window[wx].getOpenDataContext().postMessage({ action });
        }
    }

    protected initTouchEvent() {
        super.initTouchEvent();
        ya.button.addClick(this.btnClose, ()=>{
            this.onClickClose();
        });

        ya.button.addClick(this.btnShare, ()=>{
            this.onClickShare();
        });

        ya.button.addClick(this.btnMain, ()=>{
            this.onClickMain();
        });

        ya.button.addClick(this.btnRestart, ()=>{
            this.onClickRestart();
        });
    }

    protected update(dt: number) {
        super.update(dt);

        const wx = 'wx';
        if (this.isSupportWx) {
            this._wxTex.initWithElement(window[wx].getOpenDataContext().canvas);
            this._wxTex.handleLoadedTexture();
            this._wxSpriteFrame.setTexture(this._wxTex);
            this.imgRank.getComponent(cc.Sprite).spriteFrame = this._wxSpriteFrame;
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
        let title = '';
        let str = '';
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

        ya.utils.doCallback(this.restartCb);
    }

    onClickMain () {
        this.removeSelf();

        ya.utils.doCallback(this.mainCb);
    }
}

export {SettleView};
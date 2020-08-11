import { GameConstant } from "../../config/GameConstant";
import {ya} from "../../framework/ya";

const {ccclass, property} = cc._decorator;

@ccclass
class RankView extends ya.View {
    @property(cc.Node) ndRank: cc.Node = null;
    @property(cc.Node) imgRank: cc.Node = null;
    @property(cc.Node) btnStar: cc.Node = null;
    @property(cc.Node) btnUnion: cc.Node = null;
    @property(cc.Node) btnRussia: cc.Node = null;

    mode = -1;

    viewWidth = 500;
    viewHeight = 790;

    isSupportWx = false;

    wxTexture: cc.Texture2D = null;
    wxSpriteFrame: cc.SpriteFrame = null;

    protected initData(data?: any) {
        super.initData(data);

        this.mode = data.mode || GameConstant.GAME_MODE.STAR;
        const wx = 'wx';
        this.isSupportWx = cc.sys.platform === cc.sys.WECHAT_GAME && (!!(window[wx] && window[wx].getOpenDataContext));
    }

    protected initUI() {
        super.initUI();

        let action = 0;
        if (this.mode === GameConstant.GAME_MODE.STAR) {
            action = GameConstant.WX.AC_F_STAR_FETCH;
        }
        else if (this.mode === GameConstant.GAME_MODE.UNION) {
            action = GameConstant.WX.AC_F_UNION_FETCH;
        }
        else if (this.mode === GameConstant.GAME_MODE.RUSSIA) {
            action = GameConstant.WX.AC_F_RUSSIA_FETCH;
        }

        const wx = 'wx';
        if (this.isSupportWx) {
            const canvas = window[wx].getOpenDataContext().canvas;
            canvas.width = this.viewWidth;
            canvas.height = this.viewHeight;

            this.wxTexture = new cc.Texture2D();
            this.wxSpriteFrame = new cc.SpriteFrame();

            window[wx].getOpenDataContext().postMessage({ action });
        }
    }

    protected initTouchEvent() {
        super.initTouchEvent();
        if (this.isSupportWx) {
            this.ndRank.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event) => {
                this.onMove(event);
            }, this);
        }

        ya.button.addClick(this.btnStar, ()=>{
            this.onClickStar();
        });
        ya.button.addClick(this.btnUnion, ()=>{
            this.onClickUnion();
        });
        ya.button.addClick(this.btnRussia, ()=>{
            this.onClickRussia();
        });
    }

    protected update(dt: number) {
        super.update(dt);

        const wx = 'wx';
        if (this.isSupportWx) {
            this.wxTexture.initWithElement(window[wx].getOpenDataContext().canvas);
            this.wxTexture.handleLoadedTexture();
            this.wxSpriteFrame.setTexture(this.wxTexture);
            this.imgRank.getComponent(cc.Sprite).spriteFrame = this.wxSpriteFrame;
        }
    }

    onMove (event: any) {
        const touch = event.touch;
        const curp = touch.getLocation();
        const prep = touch.getPreviousLocation();

        const wx = 'wx';
        const action = GameConstant.WX.AC_SCROLL_V;
        if (this.isSupportWx) {
            window[wx].getOpenDataContext().postMessage({ action, offsety: curp.y - prep.y });
        }
    }

    onClickClose() {
        ya.viewManager.show('main', null, true);
    }

    onClickStar () {
        if (this.mode === GameConstant.GAME_MODE.STAR) return;

        this.mode = GameConstant.GAME_MODE.STAR;

        const wx = 'wx';
        if (this.isSupportWx) {
            window[wx].getOpenDataContext().postMessage({ action: GameConstant.WX.AC_F_STAR_FETCH });
        }
    }

    onClickUnion () {
        if (this.mode === GameConstant.GAME_MODE.UNION) return;

        this.mode = GameConstant.GAME_MODE.UNION;

        const wx = 'wx';
        if (this.isSupportWx) {
            window[wx].getOpenDataContext().postMessage({ action: GameConstant.WX.AC_F_UNION_FETCH });
        }
    }

    onClickRussia() {
        if (this.mode === GameConstant.GAME_MODE.RUSSIA) return;

        this.mode = GameConstant.GAME_MODE.RUSSIA;

        const wx = 'wx';
        if (this.isSupportWx) {
            window[wx].getOpenDataContext().postMessage({ action: GameConstant.WX.AC_F_RUSSIA_FETCH });
        }
    }
}

export {RankView};
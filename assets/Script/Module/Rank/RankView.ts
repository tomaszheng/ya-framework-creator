import ya from "../../Framework/ya";
import GameConstant from "../../Config/GameConstant";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RankView extends ya.View {
    @property(cc.Node)
    nd_rank: cc.Node = null;

    @property(cc.Node)
    img_rank: cc.Node = null;

    @property(cc.Node)
    btn_star: cc.Node = null;

    @property(cc.Node)
    btn_union: cc.Node = null;

    @property(cc.Node)
    btn_russia: cc.Node = null;

    mode: number = -1;

    view_width: number = 500;
    view_height: number = 790;

    is_support_wx: boolean = false;

    wx_texture: cc.Texture2D = null;
    wx_spriteFrame: cc.SpriteFrame = null;
    
    onInitData (data: any) {
        this.mode = data.mode || GameConstant.GAME_MODE.STAR;

        this.is_support_wx = cc.sys.platform === cc.sys.WECHAT_GAME && (!!(window['wx'] && window['wx'].getOpenDataContext));
    }

    onInitUI () {
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

        if (this.is_support_wx) {
            let canvas = window['wx'].getOpenDataContext().canvas;
            canvas.width = this.view_width;
            canvas.height = this.view_height;

            this.wx_texture = new cc.Texture2D();
            this.wx_spriteFrame = new cc.SpriteFrame();

            window['wx'].getOpenDataContext().postMessage({ action: action });
        }
    }

    onInitClick () {
        if (this.is_support_wx) {
            this.nd_rank.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event) => {
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
    }

    update (dt: number) {
        if (this.is_support_wx) {
            this.wx_texture.initWithElement(window['wx'].getOpenDataContext().canvas);
            this.wx_texture.handleLoadedTexture();
            this.wx_spriteFrame.setTexture(this.wx_texture);
            this.img_rank.getComponent(cc.Sprite).spriteFrame = this.wx_spriteFrame;
        }
    }

    onMove (event: any) {
        let touch = event.touch;
        let curp = touch.getLocation();
        let prep = touch.getPreviousLocation();

        let action = GameConstant.WX.AC_SCROLL_V;
        if (this.is_support_wx) {
            window['wx'].getOpenDataContext().postMessage({ action: action, offsety: curp.y - prep.y });
        }
    }

    onClickClose() {
        ya.viewManager.show('main', null, true);
    }

    onClickStar () {
        if (this.mode === GameConstant.GAME_MODE.STAR) return;

        this.mode = GameConstant.GAME_MODE.STAR;

        if (this.is_support_wx) {
            window['wx'].getOpenDataContext().postMessage({ action: GameConstant.WX.AC_F_STAR_FETCH });
        }
    }

    onClickUnion () {
        if (this.mode === GameConstant.GAME_MODE.UNION) return;

        this.mode = GameConstant.GAME_MODE.UNION;

        if (this.is_support_wx) {
            window['wx'].getOpenDataContext().postMessage({ action: GameConstant.WX.AC_F_UNION_FETCH });
        }
    }

    onClickRussia() {
        if (this.mode === GameConstant.GAME_MODE.RUSSIA) return;

        this.mode = GameConstant.GAME_MODE.RUSSIA;

        if (this.is_support_wx) {
            window['wx'].getOpenDataContext().postMessage({ action: GameConstant.WX.AC_F_RUSSIA_FETCH });
        }
    }

}
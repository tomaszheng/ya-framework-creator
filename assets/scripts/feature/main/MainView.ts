import ResourceConfig from "../../config/resource/ResourceConfig";
import {StorageConfig} from "../../config/StorageConfig";
import {ya} from "../../framework/ya";
import {GameText} from "../../config/GameText";
import {EventConfig} from "../../config/EventConfig";

const {ccclass, property} = cc._decorator;

@ccclass
class MainView extends ya.View {
    @property(cc.Node) imgBg: cc.Node = null;
    @property(cc.Node) btnSound: cc.Node = null;
    @property(cc.Node) btnCustomerService: cc.Node = null;
    @property(cc.Node) btnGameClub: cc.Node = null;
    @property(cc.Node) btnShare: cc.Node = null;
    @property(cc.Node) btnRank: cc.Node = null;
    @property(cc.Node) btnMore: cc.Node = null;
    @property(cc.Node) btnRecommend: cc.Node = null;
    @property(cc.Node) lblTagRecommend: cc.Node = null;
    @property(cc.Node) btnHot: cc.Node = null;
    @property(cc.Node) lblTagHot: cc.Node = null;
    @property(cc.Node) btnPlayed: cc.Node = null;
    @property(cc.Node) lblTagPlayed: cc.Node = null;
    @property(cc.Node) lblTitle: cc.Node = null;
    @property(cc.Node) imgTitleBg: cc.Node = null;

    protected initUI() {
        super.initUI();

        this.runRelativeAction();

        cc.tween(this.node)
            .repeatForever(
                cc.tween()
                    .delay(2.0)
                    .call(()=>{
                        this.runBounceAction(this.btnRecommend, this.lblTagRecommend);
                    })
                    .delay(3.0)
                    .call(()=>{
                        this.runBounceAction(this.btnHot, this.lblTagHot);
                    })
                    .delay(3.0)
                    .call(()=>{
                        this.runBounceAction(this.btnPlayed, this.lblTagPlayed);
                    })
                    .delay(1.0)
            )
            .start();

        const enabled = ya.soundManager.music;
        this.btnSound.getChildByName("Label").getComponent(cc.Label).string = enabled ? GameText.str_005 : GameText.str_006;

        this.scheduleOnce(()=>{
            this.setGameClub();
        }, 0.1);
    }

    protected initTouchEvent() {
        super.initTouchEvent();

        ya.button.addClick(this.btnSound, ()=>{
            this.onClickSound();
        });
        ya.button.addClick(this.btnCustomerService, ()=>{
            this.onClickCustomerService();
        });
        ya.button.addClick(this.btnGameClub, ()=>{
            this.onClickGameClub();
        });
        ya.button.addClick(this.btnShare, ()=>{
            this.onClickShare();
        });
        ya.button.addClick(this.btnRank, ()=>{
            this.onClickRank();
        });
        ya.button.addClick(this.btnMore, ()=>{
            this.onClickMoreGame();
        });
        ya.button.addClick(this.btnRecommend, ()=>{
            this.onClickRecommend();
        });
        ya.button.addClick(this.btnHot, ()=>{
            this.onClickHot();
        });
        ya.button.addClick(this.btnPlayed, ()=>{
            this.onClickPlayed();
        });
    }

    initCubeSnow () {
        // let node = new cc.Node();
        // node.anchorX = node.anchorY = 0;
        // node.addComponent(CubeSnowAnimation);
        // this.img_bg.addChild(node, -1);
    }

    onClickRecommend () {
        ya.resourceManager.load(ResourceConfig.game_star, () => {
            const data = ya.localStorage.getObject(StorageConfig.STAR_ARCHIVE);
            if (data && data.l > 0) {
                ya.eventDispatcher.dispatch(EventConfig.EVT_SHOW_ARCHIVE, {
                    continue_cb: () => {
                        ya.viewManager.show('star', null, true);
                    },
                    restart_cb: () => {
                        ya.localStorage.clear(StorageConfig.STAR_ARCHIVE);
                        ya.viewManager.show('star', null, true);
                    }
                });
            }
            else {
                ya.viewManager.show('star', null, true);
            }
        });
    }

    onClickHot() {
        ya.resourceManager.load(ResourceConfig.game_union, () => {
            const data = ya.localStorage.getObject(StorageConfig.UNION_ARCHIVE);
            if (data && data.s > 0) {
                ya.eventDispatcher.dispatch(EventConfig.EVT_SHOW_ARCHIVE, {
                    continue_cb: () => {
                        ya.viewManager.show('union', null, true);
                    },
                    restart_cb: () => {
                        ya.localStorage.clear(StorageConfig.UNION_ARCHIVE);
                        ya.viewManager.show('union', null, true);
                    }
                });
            }
            else {
                ya.viewManager.show('union', null, true);
            }
        });
    }

    onClickPlayed() {
        ya.resourceManager.load(ResourceConfig.game_russia, () => {
            const data = ya.localStorage.getObject(StorageConfig.RUSSIA_ARCHIVE);
            if (data && data.s > 0) {
                ya.eventDispatcher.dispatch(EventConfig.EVT_SHOW_ARCHIVE, {
                    continue_cb: () => {
                        ya.viewManager.show('russia', null, true);
                    },
                    restart_cb: () => {
                        ya.localStorage.clear(StorageConfig.RUSSIA_ARCHIVE);
                        ya.viewManager.show('russia', null, true);
                    }
                });
            }
            else {
                ya.viewManager.show('russia', null, true);
            }
        });
    }

    onClickMoreGame() {
        ya.eventDispatcher.dispatch(EventConfig.SHOW_TOAST, {txt: GameText.str_008});
    }

    onClickRank() {
        ya.resourceManager.load(ResourceConfig.rank, () => {
            ya.viewManager.show('rank', null, true);
        });
    }

    onClickShare() {
        // ya.platform.share({
        //     title: ya.txt.share_title_common,
        // });
    }

    onClickAbout() {

    }

    onClickCustomerService() {
        // if (!ya.platform.isSupportCustomerService()) {
        //     ya.event.emit(ya.ekey.SHOW_TOAST, {txt: ya.txt.str_009});
        // }
        // else {
        //     ya.platform.openCustomerService();
        // }
    }

    setGameClub() {
        const p = this.btnGameClub.parent.convertToWorldSpaceAR(this.btnGameClub.position);
        const size = this.btnGameClub.getContentSize();

        const lx = p.x - size.width * 0.5;
        const ty = p.y + size.height * 0.5;

        const fsz = cc.view.getFrameSize();
        const dsz = cc.view.getDesignResolutionSize();
        const scale = fsz.width / dsz.width;

        // ya.platform.createGameClubButton({
        //     left: lx * scale,
        //     top: fsz.height - ty * scale,
        //     width: size.width * scale,
        //     height: size.height * scale,
        // });
    }

    onClickGameClub() {
        // if (!ya.platform.isSupportGameClub()) {
        //     ya.event.emit(ya.ekey.SHOW_TOAST, { txt: ya.txt.str_010 });
        // }
    }

    onClickSound () {
        const enabled = !ya.localStorage.getBool(ya.StorageConfig.EFFECT_ENABLED, true);
        if (enabled) {
            ya.soundManager.playMusic('Sound/bmg', true);
        }
        else {
            ya.soundManager.stopMusic();
        }

        this.btnSound.getChildByName("Label").getComponent(cc.Label).string = enabled ? GameText.str_005 : GameText.str_006;

        ya.soundManager.music = enabled;
        ya.soundManager.effect = enabled;
    }

    runRelativeAction () {
        cc.tween(this.lblTitle)
            .repeatForever(
                cc.tween()
                    .by(2, {position: cc.v2(0, 32)})
                    .by(2, {position: cc.v2(0, -32)}))
            .start();
        cc.tween(this.imgTitleBg)
            .delay(2)
            .repeatForever(
                cc.tween()
                    .by(2, {position: cc.v2(0, 32)})
                    .by(2, {position: cc.v2(0, -32)}))
            .start();
    }

    runBounceAction (node: cc.Node, subNode: cc.Node) {
        cc.tween(node)
            .parallel(
                cc.tween().by(0.2, {position: cc.v2(0, 30)}, {easing: "sineOut"}),
                cc.tween().to(0.1, {angle: 10})
            )
            .to(0.2, {angle: -10})
            .to(0.2, {angle: 10})
            .to(0.2, {angle: -10})
            .to(0.2, {angle: 10})
            .to(0.1, {angle: 0})
            .by(0.2, {position: cc.v2(0, -30)}, {easing: "sineIn"})
            .start();

        cc.tween(subNode)
            .parallel(
                cc.tween()
                    .by(0.7, {position: cc.v2(0, 80)}, {easing: "sineOut"})
                    .by(0.7, {position: cc.v2(0, -80)}, {easing: "sineIn"}),
                cc.tween()
                    .by(0.7, {angle: -10})
                    .by(0.7, {angle: 10})
            )
            .start();
    }

    onDestroy() {
        // ya.platform.destoryGameClubButton();
    }
}

export {MainView};
import ya from "../../Framework/ya";
import ResourceConfig from "../../Config/res/ResourceConfig";
import StorageConfig from "../../Config/StorageConfig";
import EventConfig from "../../Config/EventConfig";
import GameText from "../../Config/GameText";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MainView extends ya.View {
    @property(cc.Node)
    img_bg: cc.Node = null;

    @property(cc.Node)
    btn_sound: cc.Node = null;

    @property(cc.Node)
    btn_customer_service: cc.Node = null;

    @property(cc.Node)
    btn_game_club: cc.Node = null;

    @property(cc.Node)
    btn_share: cc.Node = null;

    @property(cc.Node)
    btn_rank: cc.Node = null;

    @property(cc.Node)
    btn_more: cc.Node = null;

    @property(cc.Node)
    btn_recommend: cc.Node = null;

    @property(cc.Node)
    lbl_tag_recommend: cc.Node = null;

    @property(cc.Node)
    btn_hot: cc.Node = null;

    @property(cc.Node)
    lbl_tag_hot: cc.Node = null;

    @property(cc.Node)
    btn_played: cc.Node = null;

    @property(cc.Node)
    lbl_tag_played: cc.Node = null;

    @property(cc.Node)
    lbl_title: cc.Node = null;

    @property(cc.Node)
    img_title_bg: cc.Node = null;

    onInitUI () {
        this.runRelativeAction();

        cc.tween(this.node)
            .repeatForever(
                cc.tween()
                    .delay(2.0)
                    .call(()=>{
                        this.runBounceAction(this.btn_recommend, this.lbl_tag_recommend);
                    })
                    .delay(3.0)
                    .call(()=>{
                        this.runBounceAction(this.btn_hot, this.lbl_tag_hot);
                    })
                    .delay(3.0)
                    .call(()=>{
                        this.runBounceAction(this.btn_played, this.lbl_tag_played);
                    })
                    .delay(1.0)
            )
            .start();
        
        let enabled = ya.soundManager.music;
        this.btn_sound.getChildByName("Label").getComponent(cc.Label).string = enabled ? GameText.str_005 : GameText.str_006;

        this.scheduleOnce(()=>{
            this.setGameClub();
        }, 0.1);
    }
    
    onInitClick () {
        ya.utils.addClickEvent(this.btn_sound, ()=>{
            this.onClickSound();
        });
        ya.utils.addClickEvent(this.btn_customer_service, ()=>{
            this.onClickCostomerService();
        });
        ya.utils.addClickEvent(this.btn_game_club, ()=>{
            this.onClickGameClub();
        });
        ya.utils.addClickEvent(this.btn_share, ()=>{
            this.onClickShare();
        });
        ya.utils.addClickEvent(this.btn_rank, ()=>{
            this.onClickRank();
        });
        ya.utils.addClickEvent(this.btn_more, ()=>{
            this.onClickMoreGame();
        });

        ya.utils.addClickEvent(this.btn_recommend, ()=>{
            this.onClickRecommend();
        });
        ya.utils.addClickEvent(this.btn_hot, ()=>{
            this.onClickHot();
        });
        ya.utils.addClickEvent(this.btn_played, ()=>{
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
            let data = ya.localStorage.obj(StorageConfig.STAR_ARCHIVE);
            if (data && data.l > 0) {
                ya.eventDispatcher.emit(EventConfig.EVT_SHOW_ARCHIVE, {
                    continue_cb: () => {
                        ya.viewManager.show('star', null, true);
                    },
                    restart_cb: () => {
                        ya.localStorage.clean(StorageConfig.STAR_ARCHIVE);
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
            let data = ya.localStorage.obj(StorageConfig.UNION_ARCHIVE);
            if (data && data.s > 0) {
                ya.eventDispatcher.emit(EventConfig.EVT_SHOW_ARCHIVE, {
                    continue_cb: () => {
                        ya.viewManager.show('union', null, true);
                    },
                    restart_cb: () => {
                        ya.localStorage.clean(StorageConfig.UNION_ARCHIVE);
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
            let data = ya.localStorage.obj(StorageConfig.RUSSIA_ARCHIVE);
            if (data && data.s > 0) {
                ya.eventDispatcher.emit(EventConfig.EVT_SHOW_ARCHIVE, {
                    continue_cb: () => {
                        ya.viewManager.show('russia', null, true);
                    },
                    restart_cb: () => {
                        ya.localStorage.clean(StorageConfig.RUSSIA_ARCHIVE);
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
        ya.eventDispatcher.emit(EventConfig.SHOW_TOAST, {txt: GameText.str_008});
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

    onClickCostomerService() {
        // if (!ya.platform.isSupportCustomerService()) {
        //     ya.event.emit(ya.ekey.SHOW_TOAST, {txt: ya.txt.str_009});
        // }
        // else {
        //     ya.platform.openCustomerService();
        // }
    }

    setGameClub() {
        let p = this.btn_game_club.parent.convertToWorldSpaceAR(this.btn_game_club.position);
        let size = this.btn_game_club.getContentSize();

        let lx = p.x - size.width * 0.5;
        let ty = p.y + size.height * 0.5;

        let fsz = cc.view.getFrameSize();
        let dsz = cc.view.getDesignResolutionSize();
        let scale = fsz.width / dsz.width;

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
        let enabled = !ya.localStorage.bool(ya.StorageConfig.EFFECT_ENABLED, true);
        if (enabled) {
            ya.soundManager.playMusic('sounds/bmg', true);
        }
        else {
            ya.soundManager.stopMusic();
        }

        this.btn_sound.getChildByName("Label").getComponent(cc.Label).string = enabled ? GameText.str_005 : GameText.str_006;

        ya.soundManager.music = enabled;
        ya.soundManager.effect = enabled;
    }

    runRelativeAction () {
        cc.tween(this.lbl_title)
            .repeatForever(
                cc.tween()
                    .by(2, {position: cc.v2(0, 32)})
                    .by(2, {position: cc.v2(0, -32)}))
            .start();
        
        cc.tween(this.img_title_bg)
            .delay(2)
            .repeatForever(
                cc.tween()
                    .by(2, {position: cc.v2(0, 32)})
                    .by(2, {position: cc.v2(0, -32)}))
            .start();
    }

    runBounceAction (node: cc.Node, sub_node: cc.Node) {
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

        cc.tween(sub_node)
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

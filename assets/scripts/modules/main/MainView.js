
let View = require("../../components/mvc/View");

// let CubeSnowAnimation = require("../../widgets/CubeSnowAnimation");

cc.Class({
    extends: View,

    properties: {
        img_bg: cc.Node,

        btn_sound: cc.Node,
        btn_customer_service: cc.Node,
        btn_game_club: cc.Node,
        btn_share: cc.Node,
        btn_rank: cc.Node,
        btn_more: cc.Node,

        btn_recommend: cc.Node,
        lbl_tag_recommend: cc.Node,
        btn_hot: cc.Node,
        lbl_tag_hot: cc.Node,
        btn_played: cc.Node,
        lbl_tag_played: cc.Node,

        lbl_title: cc.Node,
        img_title_bg: cc.Node,
    },

    initUI() {
        // this.initCubeSnow();

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
        
        let enabled = ya.music.music;
        this.btn_sound.getChildByName("Label").getComponent(cc.Label).string = enabled ? ya.txt.str_005 : ya.txt.str_006;

        this.scheduleOnce(()=>{
            this.setGameClub();
        }, 0.1);
    },

    initData() {

    },

    initEvent() {

    },

    initClick() {

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
    },

    initCubeSnow() {
        // let node = new cc.Node();
        // node.anchorX = node.anchorY = 0;
        // node.addComponent(CubeSnowAnimation);
        // this.img_bg.addChild(node, -1);
    },

    onClickRecommend() {
        ya.rm.checkLoad("game_star", ()=>{
            let data = ya.storage.obj(ya.skey.STAR_ARCHIVE);
            if (data && data.l > 0) {
                ya.event.emit(ya.ekey.EVT_SHOW_ARCHIVE, {
                    continue_cb: ()=>{
                        ya.mm.show("star", null, true);
                    },
                    restart_cb: ()=>{
                        ya.storage.clean(ya.skey.STAR_ARCHIVE);
                        ya.mm.show("star", null, true);
                    }
                });
            }
            else {
                ya.mm.show("star", null, true);
            }
        });
    },
    onClickHot() {
        ya.rm.checkLoad("game_union", ()=>{
            let data = ya.storage.obj(ya.skey.UNION_ARCHIVE);
            if (data && data.s > 0) {
                ya.event.emit(ya.ekey.EVT_SHOW_ARCHIVE, {
                    continue_cb: ()=>{
                        ya.mm.show("union", null, true);
                    },
                    restart_cb: ()=>{
                        ya.storage.clean(ya.skey.UNION_ARCHIVE);
                        ya.mm.show("union", null, true);
                    }
                });
            }
            else {
                ya.mm.show("union", null, true);
            }
        });
    },
    onClickPlayed() {
        ya.rm.checkLoad("game_russia", ()=>{
            let data = ya.storage.obj(ya.skey.RUSSIA_ARCHIVE);
            if (data && data.l > 0) {
                ya.event.emit(ya.ekey.EVT_SHOW_ARCHIVE, {
                    continue_cb: ()=>{
                        ya.mm.show("russia", null, true);
                    },
                    restart_cb: ()=>{
                        ya.storage.clean(ya.skey.RUSSIA_ARCHIVE);
                        ya.mm.show("russia", null, true);
                    }
                });
            }
            else {
                ya.mm.show("russia", null, true);
            }
        });
    },

    onClickMoreGame() {
        ya.event.emit(ya.ekey.SHOW_TOAST, {txt: ya.txt.str_008});
    },

    onClickRank() {
        ya.rm.checkLoad("rank", ()=>{
            ya.mm.show("rank", null, true);
        });
    },

    onClickShare() {
        ya.platform.share({
            title: ya.txt.share_title_common,
        });
    },

    onClickAbout() {

    },

    onClickCostomerService() {
        if (!ya.platform.isSupportCustomerService()) {
            ya.event.emit(ya.ekey.SHOW_TOAST, {txt: ya.txt.str_009});
        }
        else {
            ya.platform.openCustomerService();
        }
    },

    setGameClub() {
        let p = this.btn_game_club.parent.convertToWorldSpaceAR(this.btn_game_club.position);
        let size = this.btn_game_club.getContentSize();

        let lx = p.x - size.width * 0.5;
        let ty = p.y + size.height * 0.5;

        let fsz = cc.view.getFrameSize();
        let dsz = cc.view.getDesignResolutionSize();
        let scale = fsz.width / dsz.width;

        ya.platform.createGameClubButton({
            left: lx * scale,
            top: fsz.height - ty * scale,
            width: size.width * scale,
            height: size.height * scale,
        });
    },
    onClickGameClub() {
        if (!ya.platform.isSupportGameClub()) {
            ya.event.emit(ya.ekey.SHOW_TOAST, { txt: ya.txt.str_010 });
        }
    },

    onClickSound() {
        let enabled = !ya.storage.bool(ya.skey.EFFECT_ENABLED, true);
        this.btn_sound.getChildByName("Label").getComponent(cc.Label).string = enabled ? ya.txt.str_005 : ya.txt.str_006;
        ya.music.effect = enabled;
        ya.music.music = enabled;
        if (enabled) {
            ya.music.sineInMusic(ya.res.sound_bgm, true);
        }
        else {
            ya.music.sineOutMusic();
        }
    },

    runRelativeAction() {
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
    },

    // fallingComplete() {
    //     this.setGameClub();
    // },

    // runFallingAction(i) {
    //     if (i >= this.falling_node_list.length) return;

    //     let p;
    //     if (i > 0)  {
    //         p = this.falling_node_list[i - 1].position;
    //     }
    //     else {
    //         p = cc.v2(70, cc.winSize.height - 270 + 90);
    //     }

    //     this.falling_node_list[i].position = p;
    //     this.falling_node_list[i].runAction(cc.sequence(
    //         cc.moveBy(0.5, cc.v2(0, -90)).easing(cc.easeIn(2)),
    //         cc.callFunc(()=>{
    //             this.runFallingAction(i + 1);
    //         }),
    //         cc.spawn(cc.jumpBy(1, 0, -20, 20, 2),
    //             cc.sequence(
    //                 cc.scaleTo(0.1, 0.9, 1.1),
    //                 cc.scaleTo(0.1, 1.0, 1.0),
    //                 cc.scaleTo(0.1, 1.08, 0.92),
    //                 cc.scaleTo(0.1, 1.0, 1.0),
    //                 cc.scaleTo(0.1, 0.94, 1.06),
    //                 cc.scaleTo(0.1, 1.0, 1.0),
    //                 cc.scaleTo(0.1, 1.04, 0.96),
    //                 cc.scaleTo(0.1, 1.0, 1.0),
    //                 cc.scaleTo(0.1, 0.98, 1.02),
    //                 cc.scaleTo(0.1, 1.0, 1.0),
    //             )),
    //         cc.callFunc(()=>{
    //             if (i === this.falling_node_list.length - 1) {
    //                 this.fallingComplete();
    //             }
    //         })
    //     ));
    // },

    runBounceAction(node, sub_node) {

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
    },

    onDestroy() {
        ya.platform.destoryGameClubButton();
    },
});
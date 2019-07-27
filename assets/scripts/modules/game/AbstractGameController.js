
let Controller = require("../../components/mvc/Controller");

let SC = require("../../configs/game/StarConfig");

cc.Class({

    extends: Controller,

    // override
    initModel() {
        this.game_mode = ya.const.GAME_MODE.STAR;

        this.model = ya.model.game.star;

        this.CFG = SC;
    },

    initModuleEvent() {
        this.addModuleEvent(ya.ekey.EVT_GAME_OVER, this.onGameOver, this);
        this.addModuleEvent(ya.ekey.EVT_GAME_EXIT, this.onGameExit, this);
        this.addModuleEvent(ya.ekey.EVT_GAME_USE_DYE, this.onUseDye, this);
        this.addModuleEvent(ya.ekey.EVT_GAME_USE_BOMB, this.onUseBomb, this);
        this.addModuleEvent(ya.ekey.EVT_GAME_SHOW_ITEM, this.onShowItem, this);
        this.addModuleEvent(ya.ekey.EVT_GAME_ITEM_LACK, this.onItemLack, this);
    },

    onGameOver() {
        let revive_mode = this.model.getReviveMode();
        if (revive_mode === ya.const.REVIVE_MODE.NONE) {
            this.showSettle();
        }
        else {
            ya.event.emit(ya.ekey.EVT_SHOW_REVIVE, {
                mode: revive_mode,
                score: this.model.score,
                revive_num: this.model.revive_num,
                total_num: this.CFG.REVIVE_NUM,
                success_cb: () => {
                    this.reviveSuccess();
                },
                fail_cb: () => {
                    this.showSettle();
                }
            });
        }
    },

    // override
    showSettle() {
        this.reportWeekScore();

        ya.event.emit(ya.ekey.EVT_SHOW_SETTLE, {
            mode: this.game_mode,
            score: this.model.score,
            restart_cb: () => {
                this.view.restart();
            },
            main_cb: () => {
                ya.mm.show("main", null, true);
            }
        });
    },
    // override
    reportWeekScore() {
        //清理存档
        ya.storage.clean(ya.skey.STAR_ARCHIVE);
    },
    // override
    reviveSuccess() {
        this.model.revive_num += 1;

        this.view.revive();
    },
    reviveFail() {
        ya.mm.show("main", null, true);
    },

    onGameExit() {
        ya.mm.show("main", null, true);
    },

    onUseDye(params) {
        this.view.useItemDye(params);
    },
    onUseBomb(params) {
        this.view.useItemBomb(params);
    },

    onShowItem(params) {
        let items = params.items || [];
        let content = params.content;

        if (items.length <= 0) return;

        for (let i = 0; i < items.length; i++) {
            items[i] = {mode: items[i], num: 1};
        }

        let add_item = (n) => {
            for (let i = 0; i < items.length; i++) {
                items[i].num = n;
                ya.model.item.addItemNum(items[i].mode, n);
            }
            this.view.runGotItemAction(items);
        };

        let data = {};
        data.items = items;
        data.content = content;
        data.got_mode = this.model.getItemGotMode();
        data.normal_cb = () => {
            add_item(1);
        };
        data.double_cb = () => {
            add_item(2);
        };

        ya.event.emit(ya.ekey.EVT_SHOW_ITEM, data);
    },

    onItemLack(params) {
        let mode = params.mode;
        let got_mode = params.got_mode;
        
        let add_item = ()=>{
            ya.model.item.addItemNum(mode, 1);
            this.view.runGotItemAction([{mode: mode, num: 1}]);
        };

        if (got_mode === ya.const.REVIVE_MODE.SHARE) {
            ya.platform.share({
                title: ya.txt.share_title_common,
                imageUrl: ya.res.share_common_img,
                cb: (code)=>{
                    if (code === 0) {
                        add_item();
                    }
                }
            });
        }
        else if (got_mode === ya.const.REVIVE_MODE.VIDEO) {
            ya.platform.showVideoAd((is_ended)=>{
                if (is_ended) {
                    add_item();
                }
            });
        }
        else {
            ya.event.emit(ya.ekey.SHOW_TOAST, {txt: ya.txt.str_018});
        }
    }

});
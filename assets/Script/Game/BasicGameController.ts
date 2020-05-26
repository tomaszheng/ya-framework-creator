import ya from "../Framework/ya";
import EventConfig from "../Config/EventConfig";
import GameConstant from "../Config/GameConstant";
import StorageConfig from "../Config/StorageConfig";
import GameText from "../Config/GameText";

export default class BasicGameController extends ya.Controller {
    get root () {
        return ya.layer.view;
    }

    gameMode: number;
    gameCfg: any;

    onInitLifeListener () {
        this.addLifeListener(EventConfig.EVT_GAME_OVER,         this.onGameOver,    this);
        this.addLifeListener(EventConfig.EVT_GAME_EXIT,         this.onGameExit,    this);
        this.addLifeListener(EventConfig.EVT_GAME_USE_DYE,      this.onUseDye,      this);
        this.addLifeListener(EventConfig.EVT_GAME_USE_BOMB,     this.onUseBomb,     this);
        this.addLifeListener(EventConfig.EVT_GAME_SHOW_ITEM,    this.onShowItem,    this);
        this.addLifeListener(EventConfig.EVT_GAME_ITEM_LACK,    this.onItemLack,    this);
    }

    onGameOver () {
        let revive_mode = this.model.getReviveMode();
        if (revive_mode === GameConstant.REVIVE_MODE.NONE) {
            this.showSettle();
        }
        else {
            ya.eventDispatcher.emit(EventConfig.EVT_SHOW_REVIVE, {
                mode: revive_mode,
                score: this.model.score,
                revive_num: this.model.revive_num,
                total_num: this.gameCfg.REVIVE_NUM,
                success_cb: () => {
                    this.reviveSuccess();
                },
                fail_cb: () => {
                    this.showSettle();
                }
            });
        }
    }

    // override
    showSettle () {
        this.reportWeekScore();

        ya.eventDispatcher.emit(EventConfig.EVT_SHOW_SETTLE, {
            mode: this.gameMode,
            score: this.model.score,
            restart_cb: () => {
                this.view.restart();
            },
            main_cb: () => {
                ya.viewManager.show("main", null, true);
            }
        });
    }

    // override
    reportWeekScore() {
        //清理存档
        ya.localStorage.clean(StorageConfig.STAR_ARCHIVE);
    }

    // override
    reviveSuccess() {
        this.model.revive_num += 1;

        this.view.revive();
    }

    reviveFail () {
        ya.viewManager.show("main", null, true);
    }

    onGameExit () {
        ya.viewManager.show("main", null, true);
    }

    onUseDye (params: any) {
        this.view.useItemDye(params);
    }

    onUseBomb (params: any) {
        this.view.useItemBomb(params);
    }

    onShowItem (params: any) {
        let items = params.items || [];
        let content = params.content;

        if (items.length <= 0) return;

        for (let i = 0; i < items.length; i++) {
            items[i] = {mode: items[i], num: 1};
        }

        let add_item = (n: number) => {
            for (let i = 0; i < items.length; i++) {
                items[i].num = n;
                ya.model.item.addItemNum(items[i].mode, n);
            }
            this.view.runGotItemAction(items);
        };

        let data: any = {};
        data.items = items;
        data.content = content;
        data.got_mode = this.model.getItemGotMode();
        data.normal_cb = () => {
            add_item(1);
        };
        data.double_cb = () => {
            add_item(2);
        };

        ya.eventDispatcher.emit(EventConfig.EVT_SHOW_ITEM, data);
    }

    onItemLack (params) {
        let mode = params.mode;
        let got_mode = params.got_mode;
        
        let add_item = ()=>{
            ya.model.item.addItemNum(mode, 1);
            this.view.runGotItemAction([{mode: mode, num: 1}]);
        };

        if (got_mode === GameConstant.REVIVE_MODE.SHARE) {
            // ya.platform.share({
            //     title: ya.txt.share_title_common,
            //     imageUrl: ya.res.share_common_img,
            //     cb: (code)=>{
            //         if (code === 0) {
            //             add_item();
            //         }
            //     }
            // });
        }
        else if (got_mode === GameConstant.REVIVE_MODE.VIDEO) {
            // ya.platform.showVideoAd((is_ended)=>{
            //     if (is_ended) {
            //         add_item();
            //     }
            // });
        }
        else {
            ya.eventDispatcher.emit(EventConfig.SHOW_TOAST, {txt: GameText.str_018});
        }
    }
}

let AbstractGameController = require("../AbstractGameController");

let UC = require("../../../configs/game/UnionConfig");

cc.Class({

    extends: AbstractGameController,

    initModel() {
        this.game_mode = ya.const.GAME_MODE.UNION;

        this.model = ya.model.game.union;

        this.CFG = UC;
    },

    initView(params) {
        let prefab = cc.loader.getRes(ya.res.prefab_game_union);
        let script = cc.instantiate(prefab).getComponent("UnionGameView");
        script.init(params);
        return script;
    },

    initGlobalEvent() {
        this._super();
    },

    initModuleEvent() {
        this._super();
    },

    reportWeekScore() {
        //清理存档
        ya.storage.clean(ya.skey.UNION_ARCHIVE);

        let cur_score = this.model.score;
        let cur_time = new Date().getTime();
        let week_score = ya.storage.int(ya.skey.UNION_WEEK_SCORE, 0);
        let week_time = ya.storage.int(ya.skey.UNION_WEEK_TIME, cur_time);
        let max_score = ya.storage.int(ya.skey.UNION_MAX_SCORE, 0);

        if (!ya.utils.isSameWeek(week_time, cur_time)) {
            week_score = cur_score;
        }
        else {
            week_score = Math.max(week_score, cur_score);
        }
        max_score = Math.max(max_score, week_score);

        ya.storage.set(ya.skey.UNION_WEEK_SCORE, week_score);
        ya.storage.set(ya.skey.UNION_WEEK_TIME, cur_time);
        ya.storage.set(ya.skey.UNION_MAX_SCORE, max_score);

        ya.platform.report({ union_score: week_score, union_time: cur_time});
    },

});

let AbstractGameController = require("../AbstractGameController");

let SC = require("../../../configs/game/StarConfig");

cc.Class({

    extends: AbstractGameController,
    
    initModel() {
        this.game_mode = ya.const.GAME_MODE.STAR;

        this.model = ya.model.game.star;

        this.CFG = SC;
    },

    initView(params) {
        let prefab = cc.loader.getRes(ya.res.prefab_game_star);
        let script = cc.instantiate(prefab).getComponent("StarGameView");
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
        ya.storage.clean(ya.skey.STAR_ARCHIVE);

        let cur_time = new Date().getTime();
        let cur_score = ya.model.game.star.score;
        let week_score = ya.storage.int(ya.skey.STAR_WEEK_SCORE, 0);
        let week_time = ya.storage.int(ya.skey.STAR_WEEK_TIME, cur_time);
        let max_score = ya.storage.int(ya.skey.STAR_MAX_SCORE, 0);

        if (!ya.utils.isSameWeek(week_time, cur_time)) {
            week_score = cur_score;
        }
        else {
            week_score = Math.max(week_score, cur_score);
        }
        max_score = Math.max(max_score, week_score);

        ya.storage.set(ya.skey.STAR_WEEK_SCORE, week_score);
        ya.storage.set(ya.skey.STAR_WEEK_TIME, cur_time);
        ya.storage.set(ya.skey.STAR_MAX_SCORE, max_score);

        ya.platform.report({star_score: week_score, star_time: cur_time});
    },
});
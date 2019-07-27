
let Model = require("../../components/mvc/Model");

let SC = require("../../configs/game/StarConfig");

cc.Class({
    extends: Model,

    properties: {
        map_data: [],

        map: {
            get() {
                return this.map_data;
            }
        },

        _level: 0,
        level: {
            get() {
                return this._level;
            },
            set(l) {
                this._level = l;
                this.emit(ya.ekey.MD_GAME_LEVEL_CHANGE, {level: this._level});
            }
        },

        _goal: 0,
        goal: {
            get() {
                return this._goal;
            },
            set(g) {
                this._goal = g;
                this.emit(ya.ekey.MD_GAME_GOAL_CHANGE, {goal: this._goal});
            }
        },

        _score: 0,
        score: {
            get() {
                return this._score;
            },
            set(s) {
                this._score = s;
                this.emit(ya.ekey.MD_GAME_SCORE_CHANGE, {score: this._score});
            }
        },

        pre_score: 0, //上一关得分

        _residue_num: 0, //剩余数量
        residue_num: {
            get() {
                return this._residue_num;
            },
            set(n) {
                this._residue_num = n;
            }
        },

        //复活次数
        _revive_num: 0,
        revive_num: {
            get() {
                return this._revive_num;
            },
            set(n) {
                this._revive_num = n;
            }
        },

        _item_got_num: 0,
        item_got_num: {
            get() {
                return this._item_got_num;
            },
            set(n) {
                this._item_got_num = n;
            }
        },
    },

    ctor() {
        this.week_score = ya.storage.int(ya.skey.STAR_WEEK_SCORE, 0);
        this.week_time = ya.storage.int(ya.skey.STAR_WEEK_TIME, new Date().getTime());
        this.max_score = ya.storage.int(ya.skey.STAR_MAX_SCORE, 0);

        this.item_dye_num = ya.storage.int(ya.skey.ITEM_DYE_NUM, 0);
        this.item_mix_num = ya.storage.int(ya.skey.ITEM_MIX_NUM, 0);
        this.item_bomb_num = ya.storage.int(ya.skey.ITEM_BOMB_NUM, 0);

        if (!ya.utils.isSameWeek(this.week_time)) {
            this.week_score = 0;
        }
    },

    restart() {
        this.goal = 1000;
        this.score = 0;
        this.pre_score = 0;
        this.level = 0;
        this.revive_num = 0;
        this.item_got_num = 0;
    },

    //解析
    parse(params) {
        this.level = params.l;
        this.score = params.s;
        this.pre_score = params.p;
        this.map_data = params.m;

        this.calcGoal(this.level);

        this.residue_num = 0;
        for (let i = 0; i < SC.ROW; i++) {
            for (let j = 0; j < SC.COLUMN; j++) {
                if (this.map_data[i][j] !== SC.NONE) {
                    this.residue_num++;
                }
            }
        }
    },

    next() {
        this.refresh();

        this.level++;

        this.calcGoal(this.level);

        this.pre_score = this.score;
        
        //存档
        this.archive();

    },

    calcGoal(l) {
        if (l - 1 < SC.GOAL_LEN) {
            this.goal = SC.GOAL[l - 1];
        }
        else {
            this.goal = SC.GOAL[SC.GOAL_LEN - 1] + (l - SC.GOAL_LEN) * SC.GOAL_INC;
        }
    },

    revive() {
        let num = ya.storage.int(ya.skey.SHARE_STAR_REVIVE_NUM, 0);
        ya.storage.set(ya.skey.SHARE_STAR_REVIVE_NUM, ++num);

        this.level--;

        this.score = this.pre_score;
    },

    addScore(score) {
        this.score = this.score + score;
    },

    //重新生成
    refresh() {
        this.map_data = [];
        for (let i = 0; i < SC.ROW; i++) {
            this.map_data[i] = [];
            for (let j = 0; j < SC.COLUMN; j++) {
                this.map_data[i][j] = SC.COLOR_LIST[ya.func.randInt(0, SC.COLOR_LIST.length - 1)];
            }
        }

        this.residue_num = 100;
    },

    //打乱
    mix() {
        let temp = [];

        //先保存
        for (let i = 0; i < SC.ROW; i++) {
            for (let j = 0; j < SC.COLUMN; j++) {
                if (this.map_data[i][j] === SC.NONE) continue;
                temp.push(this.map_data[i][j]);
            }
        }

        //再随机
        for (let i = 0, r; i < SC.ROW; i++) {
            for (let j = 0; j < SC.COLUMN; j++) {
                if (this.map_data[i][j] === SC.NONE) continue;
                r = ya.func.randInt(0, temp.length - 1);
                this.map_data[i][j] = temp[r];
                temp.splice(r, 1);
            }
        }

        //存档
        this.archive();
    },

    inside(x, y) {
        return x >= 0 && x < SC.ROW && y >= 0 && y < SC.COLUMN;
    },

    swap(i, j, x, y) {
        this.map_data[i][j] ^= this.map_data[x][y];
        this.map_data[x][y] ^= this.map_data[i][j];
        this.map_data[i][j] ^= this.map_data[x][y];
    },

    dye(r, c, color) {
        if (this.map_data[r]) {
            this.map_data[r][c] = color;
        }

        this.archive();
    },

    bomb(r, c) {
        let ret = [{r: r, c: c}];
        this.map_data[r][c] = SC.NONE;

        // for (let i = 0, dr, dc; i < SC.DIR.length; i++) {
        //     dr = r + SC.DIR[i].x;
        //     dc = c + SC.DIR[i].y;
        //     if (this.inside(dr, dc) && this.map_data[dr][dc] !== SC.NONE) {
        //         this.map_data[dr][dc] = SC.NONE;
        //         ret.push({r: dr, c: dc});
        //     }
        // }

        this.residue_num -= ret.length;

        return ret;
    },

    bfs(r, c) {
        let ret = [];
        let used = [], cp;
        for (let i = 0; i < SC.ROW; i++) {
            used[i] = [];
            for (let j = 0; j < SC.COLUMN; j++) {
                used[i][j] = false;
            }
        }

        let will_list = [{ r: r, c: c }];
        used[r][c] = true;
        while (will_list.length > 0) {
            cp = will_list.shift();
            ret.push(cp);
            for (let i = 0; i < SC.DIR.length; i++) {
                let np = {};
                np.r = cp.r + SC.DIR[i].x;
                np.c = cp.c + SC.DIR[i].y;
                if (this.inside(np.r, np.c) && 
                    this.map_data[np.r][np.c] === this.map_data[r][c] &&
                    !used[np.r][np.c])
                {
                    used[np.r][np.c] = true;
                    will_list.push(np);
                }
            }
        }

        return ret;
    },

    checkRoundOver() {
        let r = -1, c = -1;
        for (let i = 0; i < SC.ROW; i++) {
            for (let j = 0; j < SC.COLUMN; j++) {
                if (this.map_data[i][j] === SC.NONE) continue;

                if ((j + 1 < SC.COLUMN && this.map_data[i][j] === this.map_data[i][j + 1]) ||
                    (i + 1 < SC.ROW && this.map_data[i][j] === this.map_data[i + 1][j]))
                {
                    r = i, c = j; break;
                }
            }
            if (r !== -1) break;
        }
        return {r: r, c: c};
    },

    checkGameOver() {
        return this.score < this.goal;
    },

    signNone(list) {
        if (list && (list instanceof Array)) {
            list.forEach(p => {
                if (this.inside(p.r, p.c)) {
                    this.map_data[p.r][p.c] = SC.NONE;

                    this.residue_num--;
                }
            });
        }
    },

    moveDown() {
        let ret = [];
        for (let i = 0; i < SC.ROW; i++) {
            ret[i] = [];
        }
        for (let j = 0; j < SC.COLUMN; j++) {
            for (let i = 0, x = 0; i < SC.ROW; i++) {
                if (this.map_data[i][j] !== SC.NONE) {
                    if (x !== i) {
                        ret[i][j] = { r: x, c: j };
                        this.swap(i, j, x, j);
                    }
                    x++;
                }
            }
        }
        return ret;
    },

    //必须先调用moveDown
    moveLeft() {
        let ret = [];
        for (let i = 0; i < SC.ROW; i++) {
            ret[i] = [];
        }

        for (let j = 0, y = 0; j < SC.COLUMN; j++) {
            if (this.map_data[0][j] === SC.NONE) continue;

            if (y !== j) {
                for (let i = 0; i < SC.ROW; i++) {
                    if (this.map_data[i][j] !== SC.NONE) {
                        ret[i][j] = { r: i, c: y };
                        this.swap(i, j, i, y);
                    }
                }
            }

            y++;
        }

        //存档
        this.archive();

        return ret;
    },

    isShareReviveEnabled() {
        let num = ya.storage.int(ya.skey.SHARE_STAR_REVIVE_NUM, 0);
        return num <= SC.REVIVE_MAX_SHARE;
    },

    getReviveMode() {
        if (this.revive_num >= SC.REVIVE_NUM) {
            return ya.const.REVIVE_MODE.NONE;
        }
        else if (ya.model.cfg.inreview) {
            return ya.const.REVIVE_MODE.FREE;
        }
        else if (this.revive_num === 0 && this.isShareReviveEnabled()) {
            return ya.const.REVIVE_MODE.SHARE;
        }
        else if (ya.platform.isSupportAd()) {
            return ya.const.REVIVE_MODE.VIDEO;
        }
        else {
            return ya.const.REVIVE_MODE.SHARE;
        }
    },

    archive() {
        let data = {
            l: this.level,
            s: this.score,
            p: this.pre_score,
            m: this.map_data
        };
        ya.storage.set(ya.skey.STAR_ARCHIVE, data);
    },

    getItemNum(mode) {
        if (mode === ya.const.ITEM_MODE.MIX) {
            return this.item_mix_num;
        }
        else if (mode === ya.const.ITEM_MODE.DYE) {
            return this.item_dye_num;
        }
        else if (mode === ya.const.ITEM_MODE.BOMB) {
            return this.item_bomb_num;
        }
        return 0;
    },
    setItemNum(mode, num) {
        num = num || 0;

        let skey = "";
        if (mode === ya.const.ITEM_MODE.MIX) {
            skey = ya.skey.ITEM_MIX_NUM;
            this.item_mix_num = num;
        }
        else if (mode === ya.const.ITEM_MODE.DYE) {
            skey = ya.skey.ITEM_DYE_NUM;
            this.item_dye_num = num;
        }
        else if (mode === ya.const.ITEM_MODE.BOMB) {
            skey = ya.skey.ITEM_BOMB_NUM;
            this.item_bomb_num = num;
        }

        skey && ya.storage.set(skey, num);

        this.emit(ya.ekey.MD_ITEM_NUM_CHANGE, {mode: mode, num: num});
    },
    isShareItemEnabled() {
        let num = ya.storage.int(ya.skey.SHARE_STAR_ITEM_NUM, 0);
        return num <= SC.ITEM_MAX_SHARE;
    },
    getItemGotMode() {
        if (ya.model.cfg.inreview) {
            return ya.const.REVIVE_MODE.NONE;
        }
        else if (this.item_got_num < SC.ITEM_NUM && this.isShareItemEnabled()) {
            return ya.const.REVIVE_MODE.SHARE;
        }
        else if (ya.platform.isSupportAd()) {
            return ya.const.REVIVE_MODE.VIDEO;
        }
        else {
            return ya.const.REVIVE_MODE.SHARE;
        }
    },
});
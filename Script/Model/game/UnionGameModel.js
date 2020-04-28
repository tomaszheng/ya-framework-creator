
let Model = require("../../components/mvc/Model");

let UC = require("../../configs/game/UnionConfig");

cc.Class({
    extends: Model,

    properties: {
        map_data: [],
        map_num: [],
        map: {
            get() {
                return this.map_data;
            }
        },
        num: {
            get() {
                return this.map_num;
            }
        },

        _score: 0,
        score: {
            get() {
                return this._score;
            },
            set(n) {
                this._score = n;
                this.emit(ya.ekey.MD_GAME_SCORE_CHANGE, {score: this._score});
            }
        },

        _goal: 0,
        goal: {
            get() {
                return this._goal;
            },
            set(n) {
                this._goal = n;
                this.emit(ya.ekey.MD_GAME_GOAL_CHANGE, {goal: this._goal});
            }
        },
        goal_level: 0,

        _revive_num: 0,
        revive_num: {
            get() {
                return this._revive_num;
            },
            set(n) {
                this._revive_num = n;
            }
        }
    },

    ctor() {
        this.week_score = ya.storage.int(ya.skey.UNION_WEEK_SCORE, 0);
        this.week_time = ya.storage.int(ya.skey.UNION_WEEK_TIME, new Date().getTime());
        this.max_score = ya.storage.int(ya.skey.UNION_MAX_SCORE, 0);

        this.item_dye_num = ya.storage.int(ya.skey.ITEM_DYE_NUM, 0);
        this.item_mix_num = ya.storage.int(ya.skey.ITEM_MIX_NUM, 0);
        this.item_bomb_num = ya.storage.int(ya.skey.ITEM_BOMB_NUM, 0);

        if (!ya.utils.isSameWeek(this.week_time)) {
            this.week_score = 0;
        }

        this.pre_color = -1;
    },

    flush() {
        this.score = 0;

        this.revive_num = 0;

        this.goal_level = 0;
        this.goal = UC.GOALS[this.goal_level];
        
        this.gen();
    },

    init() {
        this.flush();
    },

    restart() {
        this.flush();
    },

    revive() {
        let num = ya.storage.int(ya.skey.SHARE_UNION_REVIVE_NUM, 0);
        ya.storage.set(ya.skey.SHARE_UNION_REVIVE_NUM, ++num);

        this.pre_color = -1;
        
        this.gen();
    },

    addScore(n) {
        this.score += n;

        if (this.score >= this.goal) {
            this.goal_level++;

            this.calcGoal();
        }
    },
    calcGoal() {
        if (this.goal_level >= UC.GOALS.length) {
            this.goal += UC.GOAL_INC;
        }
        else {
            this.goal = UC.GOALS[this.goal_level];
        }
    },

    one() {
        let r = Math.random();
        let n = this.score / 400 + 0.5;
        if (this.pre_color === -1 || r < n) {
            this.pre_color = ya.func.randInt(0, UC.COLOR_LEN - 1);
        }
        return this.pre_color;
    },

    gen() {
        this.map_num = [];
        this.map_data = [];

        let pre = -1;
        for (let i = 0, c; i < UC.ROW; i++) {
            this.map_num[i] = [];
            this.map_data[i] = [];
            for (let j = 0; j < UC.COLUMN; j++) {
                c = this.one();
                this.map_num[i][j] = 1;
                this.map_data[i][j] = UC.COLOR_LIST[c];

                pre = c;
            }
        }

        this.archive();
    },

    inside(x, y) {
        return x >= 0 && x < UC.ROW && y >= 0 && y < UC.COLUMN;
    },

    swap(i, j, x, y) {
        this.map_data[i][j] ^= this.map_data[x][y];
        this.map_data[x][y] ^= this.map_data[i][j];
        this.map_data[i][j] ^= this.map_data[x][y];
    },

    bfs(r, c) {
        return ya.func.bfs(this.map, r, c, UC.ROW, UC.COLUMN);
    },

    signNone(list) {
        if (list && (list instanceof Array)) {
            list.forEach(p => {
                if (this.inside(p.r, p.c)) {
                    this.map_num[p.r][p.c] = 0;
                    this.map_data[p.r][p.c] = UC.NONE;
                }
            });
        }
    },

    union(list) {
        if (list && (list instanceof Array)) {
            let s = list[0];
            for (let i = 1, p; i < list.length; i++) {
                p = list[i];
                this.map_num[s.r][s.c] += this.map_num[p.r][p.c];
                this.map_num[p.r][p.c] = 0;
                this.map_data[p.r][p.c] = UC.NONE;
            }
            if (this.map_num[s.r][s.c] >= UC.MAX_NUM) {
                this.map_num[s.r][s.c] = UC.MAX_NUM;
                this.map_data[s.r][s.c] = UC.DARK;
            }
        }
    },

    move() {
        let ret = [];
        let d = this.map_data, n = this.map_num;
        for (let i = 0; i < UC.ROW; i++) {
            ret[i] = [];
        }
        for (let j = 0; j < UC.COLUMN; j++) {
            for (let i = 0, r = 0; i < UC.ROW; i++) {
                if (d[i][j] !== UC.NONE) {
                    if (r !== i) {
                        d[i][j] ^= d[r][j], d[r][j] ^= d[i][j], d[i][j] ^= d[r][j];
                        n[i][j] ^= n[r][j], n[r][j] ^= n[i][j], n[i][j] ^= n[r][j];
                        ret[i][j] = { r: r, c: j };
                    }
                    r++;
                }
            }
        }

        return ret;
    },

    pad() {
        let ret = [];
        for (let i = 0, c; i < UC.ROW; i++) {
            for (let j = 0; j < UC.COLUMN; j++) {
                if (this.map_data[i][j] === UC.NONE) {
                    c = this.one();
                    this.map_num[i][j] = 1;
                    this.map_data[i][j] = UC.COLOR_LIST[c];
                    ret.push({ r: i, c : j });
                }
            }
        }

        this.archive();
        
        return ret;
    },

    checkOver() {
        let r, c, is_over = true, n = 0;
        for (let i = 0; i < UC.ROW && is_over; i++) {
            for (let j = 0; j < UC.COLUMN; j++) {
                n = 0;
                for (let k = 0; k < UC.DIR.length; k++) {
                    r = i + UC.DIR[k].x;
                    c = j + UC.DIR[k].y;
                    if (this.inside(r, c) && this.map_data[i][j] === this.map_data[r][c]) {
                        n++;
                    }
                }
                if (n >= 2) {
                    is_over = false; break;
                }
            }
        }

        return is_over;
    },

    mix() {
        let temp = [];

        //先保存
        for (let i = 0; i < UC.ROW; i++) {
            for (let j = 0; j < UC.COLUMN; j++) {
                if (this.map_data[i][j] === UC.NONE) continue;
                temp.push({d: this.map_data[i][j], n: this.map_num[i][j]});
            }
        }

        //再随机
        for (let i = 0, r; i < UC.ROW; i++) {
            for (let j = 0; j < UC.COLUMN; j++) {
                if (this.map_data[i][j] === UC.NONE) continue;
                r = ya.func.randInt(0, temp.length - 1);
                this.map_data[i][j] = temp[r].d;
                this.map_num[i][j] = temp[r].n;
                temp.splice(r, 1);
            }
        }

        //存档
        this.archive();
    },
    dye(r, c, color) {
        if (this.map_data[r]) {
            this.map_data[r][c] = color;
        }

        //存档
        this.archive();
    },

    bomb(r, c) {
        let ret = [{r: r, c: c}];

        this.map_num[r][c] = 0;
        this.map_data[r][c] = UC.NONE;

        return ret;
    },

    parse(params) {
        this.score = params.s;
        this.goal_level = params.l;
        this.map_data = params.m;
        this.map_num = params.n;

        this.calcGoal();
    },

    archive() {
        let data = {
            l: this.goal_level,
            s: this.score,
            m: this.map_data,
            n: this.map_num,
        };
        ya.storage.set(ya.skey.UNION_ARCHIVE, data);
    },
    isShareItemEnabled() {
        let num = ya.storage.int(ya.skey.SHARE_UNION_ITEM_NUM, 0);
        return num <= UC.ITEM_MAX_SHARE;
    },
    getItemGotMode() {
        if (ya.model.cfg.inreview) {
            return ya.const.REVIVE_MODE.NONE;
        }
        else if (this.item_got_num < UC.ITEM_NUM && this.isShareItemEnabled()) {
            return ya.const.REVIVE_MODE.SHARE;
        }
        else if (ya.platform.isSupportAd()) {
            return ya.const.REVIVE_MODE.VIDEO;
        }
        else {
            return ya.const.REVIVE_MODE.SHARE;
        }
    },
    isShareReviveEnabled() {
        let num = ya.storage.int(ya.skey.SHARE_UNION_REVIVE_NUM, 0);
        return num <= UC.REVIVE_MAX_SHARE;
    },

    getReviveMode() {
        if (this.revive_num >= UC.REVIVE_NUM) {
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
});
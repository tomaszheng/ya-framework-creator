
let Model = require("../../components/mvc/Model");

let RC = require("../../configs/game/RussiaConfig");

cc.Class({
    extends: Model,

    properties: {
        _cur_shape: null,
        cur_shape: {
            get() {
                return this._cur_shape;
            },
            set(s) {
                this._cur_shape = s;
            }
        },
        _next_shape: null,
        next_shape: {
            get() {
                return this._next_shape;
            },
            set(s) {
                this._next_shape = s;
            }
        },

        cur_shape_row: 0,
        cur_shape_column: 0,

        map_data: [],
        map: {
            get() {
                return this.map_data;
            }
        },

        _score: 0,
        score: {
            get() {
                return this._score;
            },
            set(num) {
                this._score = num;
                this.emit(ya.ekey.MD_GAME_SCORE_CHANGE, {score: this._score});
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
    },

    ctor() {
        
        this.revive_num = 0;
    },

    getShapeModel() {
        let shape = [];
        for (let i = 0; i < RC.U_ROW; i++) {
            shape[i] = [];
            for (let j = 0; j < RC.U_COLUMN; j++) {
                shape[i][j] = RC.NONE;
            }
        }
        return shape;
    },

    randColor() {
        return RC.COLOR_LIST[ya.func.randInt(0, RC.COLOR_LIST.length - 1)];
    },

    restart() {
        this.map_data = [];
        for (let i = 0; i < RC.ROW; i++) {
            this.map_data[i] = [];
            for (let j = 0; j < RC.COLUMN; j++) {
                this.map_data[i][j] = RC.NONE;
            }
        }

        this.cur_shape_row = RC.ROW;
        this.cur_shape_column = RC.SHAPE_COLUMN_INDEX;

        this.cur_shape = this.genShape();
        this.next_shape = this.genShape();

        this.score = 0;
        this.revive_num = 0;
    },

    revive() {
        let num = ya.storage.int(ya.skey.SHARE_RUSSIA_REVIVE_NUM, 0);
        ya.storage.set(ya.skey.SHARE_RUSSIA_REVIVE_NUM, ++num);

        let ret = [];
        for (let i = RC.ROW - 1; i > RC.ROW - RC.REVIVE_ROW; i--) {
            for (let j = 0; j < RC.COLUMN; j++) {
                if (this.map_data[i][j] !== RC.NONE) {
                    ret.push({r: i, c: j});
                    this.map_data[i][j] = RC.NONE;
                }
            }
        }

        return ret;
    },

    next() {
        this.cur_shape_row = RC.ROW;
        this.cur_shape_column = RC.SHAPE_COLUMN_INDEX;

        this.cur_shape = this.next_shape;

        this.next_shape = this.genShape();
    },

    genShape() {
        let r = RC.SHAPES[ya.func.randInt(0, RC.SHAPE_LEN - 1)];
        let n = ya.func.randInt(0, 3);
        let shape = this["_genShape" + r]();
        for (let i = 0; i < n; i++) {
            this.rotate(shape);
        }
        return shape;
    },
    _genShape1() {
        let shape = this.getShapeModel();
        shape[1][1] = this.randColor();
        return shape;
    },
    _genShape2() {
        let shape = this.getShapeModel();
        shape[1][0] = shape[1][1] = shape[1][2] = this.randColor();
        return shape;
    },
    _genShape3() {
        let shape = this.getShapeModel(), color = this.randColor();
        shape[2][0] = color;
        shape[1][0] = shape[1][1] = shape[1][2] = color;
        return shape;
    },
    _genShape4() {
        let shape = this.getShapeModel(), color = this.randColor();
        shape[2][2] = color;
        shape[1][0] = shape[1][1] = shape[1][2] = color;
        return shape;
    },
    _genShape5() {
        let shape = this.getShapeModel(), color = this.randColor();
        shape[2][1] = color;
        shape[1][0] = shape[1][1] = shape[1][2] = color;
        return shape;
    },
    _genShape6() {
        let shape = this.getShapeModel(), color = this.randColor();
        shape[2][1] = shape[2][2] = color;
        shape[1][0] = shape[1][1] = color;
        return shape;
    },
    _genShape7() {
        let shape = this.getShapeModel(), color = this.randColor();
        shape[2][0] = shape[2][1] = color;
        shape[1][1] = shape[1][2] = color;
        return shape;
    },
    _genShape8() {
        let shape = this.getShapeModel(), color = this.randColor();
        shape[2][0] = shape[2][1] = color;
        shape[1][0] = shape[1][1] = color;
        return shape;
    },

    swap(i, j, r, c) {
        this.map_data[i][j] ^= this.map_data[r][c];
        this.map_data[r][c] ^= this.map_data[i][j];
        this.map_data[i][j] ^= this.map_data[r][c];
    },

    rotate(s) {
        let t = s[0][0];
        s[0][0] = s[0][2];
        s[0][2] = s[2][2];
        s[2][2] = s[2][0];
        s[2][0] = t;

        t = s[1][0];
        s[1][0] = s[0][1];
        s[0][1] = s[1][2];
        s[1][2] = s[2][1];
        s[2][1] = t;
    },

    rotateShape() {
        let back = ya.utils.clone(this.cur_shape);
        
        this.rotate(this.cur_shape);
        
        if (!this.testMove(this.cur_shape_row, this.cur_shape_column)) {

            let t = this.testCross(this.cur_shape_row, this.cur_shape_column);
            if (t === 1) { //超出左边
                let cl = this.cur_shape_column + 1;
                if (!this.testMove(this.cur_shape_row, cl)) {
                    this.cur_shape = back;
                }
                else {
                    this.cur_shape_column = cl;
                }
            }
            else if (t === 2) { //超出右边     
                let cr = this.cur_shape_column - 1;
                if (!this.testMove(this.cur_shape_row, cr)) {
                    this.cur_shape = back;
                }
                else {
                    this.cur_shape_column = cr;
                }
            }
            else {
                this.cur_shape = back;
            }
        }
    },

    searchHorizontal() {
        let ret = [];

        for (let i = 0, found = false; i < RC.ROW; i++) {
            found = false;
            for (let j = 0; j < RC.COLUMN; j++) {
                if (this.map_data[i][j] === RC.NONE) {
                    found = true; break;
                }
            }
            !found && (ret.push(i));
        }

        return ret;
    },

    signNone(list) {
        if (!list) return;

        !(list instanceof Array) && (list = [list]);
        
        list.forEach(r => {
            for (let j = 0; j < RC.COLUMN; j++) {
                this.map_data[r][j] = RC.NONE;
            }
        });
    },

    moveDown() {
        let ret = [];
        for (let i = 0; i < RC.ROW; i++) {
            ret[i] = [];
        }

        let tor = 0, found = false;
        for (let i = 0; i < RC.ROW; i++) {
            found = false;
            for (let j = 0; j < RC.COLUMN; j++) {
                if (this.map_data[i][j] !== RC.NONE) {
                    found = true;
                    if (i === tor) break;
                    ret[i][j] = {r: tor, c: j};
                    this.swap(i, j, tor, j);
                }
            }
            found && (tor++);
        }

        return ret;
    },

    testMove(r, c) {

        for (let i = 0; i < RC.U_ROW; i++) {
            for (let j = 0; j < RC.U_COLUMN; j++) {
                if (this.cur_shape[i][j] !== RC.NONE) {
                    if (r + i < 0 || c + j >= RC.COLUMN || c + j < 0) {
                        return false;
                    }
                    else if (r + i >= RC.ROW) {
                        continue;
                    }
                    else if (this.map_data[r + i][c + j] !== RC.NONE) {
                        return false;
                    }
                }
            }
        }

        return true;
    },

    //越界 用于testMove之后
    //return 0没有超出 1超出左边 2超出右边 3超出下边
    testCross(r, c) {
        for (let i = 0; i < RC.U_ROW; i++) {
            for (let j = 0; j < RC.U_COLUMN; j++) {
                if (this.cur_shape[i][j] !== RC.NONE) {
                    if (c + j < 0) {
                        return 1;
                    }
                    else if (c + j >= RC.COLUMN) {
                        return 2;
                    }
                    else if (r + i < 0) {
                        return 3;
                    }
                }
            }
        }

        return 0;
    },

    moveShape(r, c) {
        r = this.cur_shape_row + r;
        c = this.cur_shape_column + c;

        if (this.testMove(r, c)) {
            this.cur_shape_row = r;
            this.cur_shape_column = c;
            return true;
        }

        return false;
    },

    mapShape() {
        let ret = [], r, c;
        for (let i = 0; i < RC.U_ROW; i++) {
            ret[i] = [];
            for (let j = 0; j < RC.U_COLUMN; j++) {
                r = this.cur_shape_row + i;
                c = this.cur_shape_column + j;

                if (this.inside(r, c)) {
                    if (this.cur_shape[i][j] !== RC.NONE) {
                        this.map_data[r][c] = this.cur_shape[i][j];

                        ret[i][j] = { r: r, c: c };
                    }
                }
            }
        }
        return ret;
    },

    checkOver() {
        let is_over = false;
        for (let j = 0; j < RC.COLUMN; j++) {
            if (this.map_data[RC.ROW - 1][j] !== RC.NONE) {
                is_over = true; break;
            }
        }
        return is_over;
    },

    inside(x, y) {
        return x >= 0 && x < RC.ROW && y >= 0 && y < RC.COLUMN;
    },

    getDstRow() {
        let r, c, i, j, found = false;

        let dst_r = this.cur_shape_row;
        while (!found) {
            dst_r--;
            for (i = 0; i < RC.U_ROW && !found; i++) {
                for (j = 0; j < RC.U_COLUMN; j++) {
                    r = dst_r + i;
                    c = this.cur_shape_column + j;

                    if (r >= RC.ROW) break;
                    
                    if (this.cur_shape[i][j] !== RC.NONE) {
                        if (r < 0 || this.map_data[r][c] !== RC.NONE) {
                            found = true; break;
                        }
                    }
                }
            }
        }

        return dst_r + (found ? 1 : 0);
    },

    isShareReviveEnabled() {
        let num = ya.storage.int(ya.skey.SHARE_RUSSIA_REVIVE_NUM, 0);
        return num <= RC.REVIVE_MAX_SHARE;
    },

    getReviveMode() {
        if (this.revive_num >= RC.REVIVE_NUM) {
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
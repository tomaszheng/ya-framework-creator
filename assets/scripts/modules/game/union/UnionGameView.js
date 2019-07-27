
let AbstractGameView = require("../AbstractGameView");

let UC = require("../../../configs/game/UnionConfig");
let UP = require("./UnionPool");

cc.Class({
    extends: AbstractGameView,

    properties: {
        nd_map: cc.Node,

        lbl_score: cc.Node,
        lbl_goal: cc.Node,

        nd_item: cc.Node,
    },

    initData(params) {
        this._super(params);

        this.model = ya.model.game.union;

        this.CFG = UC;

        this.poolinstance = UP.getInstance();

        this.click_r = -1;
        this.click_c = -1;
        this.click_dst_r = -1;
        this.click_dst_c = -1;
        this.click_num = 0;

        this.is_need_breakout = false;

        let data = ya.storage.obj(ya.skey.UNION_ARCHIVE);
        if (data && data.s > 0) {
            this._is_have_archive = true;

            this.model.parse(data);
        }
        else {
            this.model.init();
        }

        this.joint_list = [];
    },

    initUI() {
        this._super();

        this.initJoint();

        this.refreshMap();

        this.setJointActive();

        this.onScoreChange({ score: this.model.score });
        this.onGoalChange({ goal: this.model.goal});

        this.erase_enabled = true;
    },

    initClick() {
        this._super();

        let start_pos, end_pos, p;
        ya.utils.addClickEvent(this.nd_map, (event) => {
            end_pos = event.touch.getLocation();
            if (this.erase_enabled &&
                Math.abs(start_pos.x - end_pos.x) < 10 &&
                Math.abs(start_pos.y - end_pos.y) < 10) {

                p = this.getCubeIndex(end_pos);
                if (p.r !== -1 && p.c !== -1) {
                    this.onClickMap(p.r, p.c);
                }
            }
        });
        ya.utils.addStartEvent(this.nd_map, (event) => {
            start_pos = event.touch.getLocation();
        });

    },

    getEnabledItemMode() {
        return [ya.const.ITEM_MODE.MIX, ya.const.ITEM_MODE.DYE, ya.const.ITEM_MODE.BOMB];
    },

    onClickMap(r, c) {
        if (!this.cube_list[r][c]) return;

        let ret = this.model.bfs(r, c);

        this.click_r = this.click_dst_r = r;
        this.click_c = this.click_dst_c = c;
        this.click_num = ret.length;

        if (this.click_num > 2) {
            this.unprompt();
            this.unblink();

            let num = this.model.num;
            if (num[r][c] >= this.CFG.MAX_NUM) {
                //突破
                this.pushScore(this.click_num * 51);
                this.is_need_breakout = true;
            }
            else {
                this.pushScore(this.click_num);
            }

            this.erase(ret);
        }
    },

    onClickItemMix() {
        if (!this.erase_enabled) return;

        this._super();

        let index = 0;
        let map = this.model.map;
        let num = this.model.num;

        this.setAllJointActive(false);

        let mix_cube = (i, j) => {
            this.cube_list[i][j].runAction(cc.sequence(
                cc.spawn(cc.scaleTo(0.3, 0.8), cc.fadeTo(0.3, 100), cc.rotateBy(0.3, 180)),
                cc.callFunc(()=>{
                    this.cube_list[i][j].color = this.CFG.COLOR[map[i][j]];
                    this.poolinstance.setCubeDigit(this.cube_list[i][j], num[i][j]);
                }),
                cc.spawn(cc.scaleTo(0.2, 1), cc.fadeIn(0.2), cc.rotateBy(0.2, 180)),
                cc.callFunc(()=>{
                    if ((--index) === 0) {
                        this.erase_enabled = true;
                        this.setJointActive();
                        this.prompt();
                    }
                })
            ));
        };

        for (let i = 0; i < this.CFG.ROW; i++) {
            for (let j = 0; j < this.CFG.COLUMN; j++) {
                if (map[i][j] !== this.CFG.NONE && this.cube_list[i][j]) {
                    index++;
                    mix_cube(i, j);
                }
            }
        }
    },

    onClickItemDye() {
        if (!this.erase_enabled) return;
        this.erase_enabled = false;

        this.setAllJointActive(false);

        let prefab = cc.loader.getRes(ya.res.prefab_game_star_item);
        let script = cc.instantiate(prefab).addComponent("UnionItemView");
        script.init({
            mode: ya.const.ITEM_MODE.DYE,
            cancel_cb: ()=>{
                this.erase_enabled = true;
                this.setJointActive();
            }
        });
        this.node.addChild(script.node);
    },
    onClickItemBomb() {
        if (!this.erase_enabled) return;

        this.setAllJointActive(false);

        let prefab = cc.loader.getRes(ya.res.prefab_game_star_item);
        let script = cc.instantiate(prefab).addComponent("UnionItemView");
        script.init({
            mode: ya.const.ITEM_MODE.BOMB,
            cancel_cb: () => {
                this.erase_enabled = true;
                this.setJointActive();
            }
        });

        this.node.addChild(script.node);
    },

    useItemDye(params) {
        this._super(params);

        let dc = this.CFG.COLOR[params.color];
        let cube = this.cube_list[params.r][params.c];
        cube.runAction(cc.sequence(
            cc.spawn(
                cc.tintTo(0.5, dc.r, dc.g, dc.b),
                cc.sequence(
                    cc.rotateTo(0.1, -10),
                    cc.rotateTo(0.1, 10),
                    cc.rotateTo(0.1, -10),
                    cc.rotateTo(0.1, 10),
                    cc.rotateTo(0.1, 0),
                )
            ),
            cc.callFunc(()=>{
                this.erase_enabled = true;
                this.setJointActive();

                this.prompt();
            })
        ));
    },

    runBombAction(r, c, cb) {
        let cur_cube = this.cube_list[r][c];
        cur_cube.runAction(cc.sequence(
            cc.spawn(cc.rotateBy(0.5, 360), cc.fadeTo(0.5, 150), cc.scaleTo(0.5, 0.8)),
            cc.callFunc(()=>{
                this.poolinstance.putCube(this.cube_list[r][c]);
                this.cube_list[r][c] = null;
                cb && cb();
            })
        ));
    },

    restart() {
        this.unblink();
        this.unprompt();
        
        for (let i = 0; i < this.CFG.ROW; i++) {
            for (let j = 0; j < this.CFG.COLUMN; j++) {
                this.cube_list[i][j] && (this.poolinstance.putCube(this.cube_list[i][j]));
            }
        }
        this.cube_list = [];

        this.model.restart();

        this.refreshMap();

        this.setJointActive();

        let goal = this.model.goal;
        this.onScoreChange({score: 0});
        this.onGoalChange({goal: goal});

        this.erase_enabled = true;
    },

    revive() {
        
        for (let i = 0; i < this.CFG.ROW; i++) {
            for (let j = 0; j < this.CFG.COLUMN; j++) {
                this.cube_list[i][j] && (this.poolinstance.putCube(this.cube_list[i][j]));
            }
        }
        this.cube_list = [];

        this.model.revive();

        this.refreshMap();

        this.setJointActive();

    },
    
    pushScore(score) {
        let goal_score = this.model.goal;

        this.model.addScore(score);

        if (this.model.score >= goal_score) {
            this.showItemView(1);
        }
    },

    onScoreChange(params) {
        let n = params.score;
        this.lbl_score.getComponent(cc.Label).string = n.toString();
    },
    onGoalChange(params) {
        let s = cc.js.formatStr(ya.txt.star_002, params.goal);
        this.lbl_goal.getComponent(cc.Label).string = s;
    },

    onItemNumChange(params) {
        let mode = params.mode;
        let num = ya.model.item.getItemNum(mode);
        let item = this.item_map[mode];
        item.setPower(num);
    },

    erase(list) {
        
        this.model.union(list);

        this.setJointActive();

        this.erase_enabled = false;

        let num = 0;
        let len = list.length;
        let click_p = this.cube_list[this.click_r][this.click_c].position;

        let eraseComplete = ()=>{
            let r = this.click_r, c = this.click_c;
            let cube = this.cube_list[r][c];
            let map = this.model.map;
            let num = this.model.num;
            cube && (cube.color = this.CFG.COLOR[map[r][c]]);
            cube && (cube.getChildByName("digit").getComponent(cc.Label).string = num[r][c].toString());
            
            let m = 0;
            for (let i = this.click_r - 1; i >= 0; i--) {
                if (map[i][this.click_c] === this.CFG.NONE) {
                    m++;
                }
            }
            this.click_dst_r = this.click_r - m;
            this.click_dst_c = this.click_c;

            this.moveDown();
        };

        for (let i = 1; i < len; i++) {
            let p = list[i];
            let cube = this.cube_list[p.r][p.c];
            if (cube) {
                num++;
                cube.zIndex = 0;
                cube.runAction(cc.sequence(
                    cc.moveTo(0.3, click_p),
                    cc.callFunc(() => {
                        this.poolinstance.putCube(cube);
                        this.cube_list[p.r][p.c] = null;
                        (--num) === 0 && (eraseComplete());
                    })));
            }
        }

        this.runLikeAction(list.length);
    },

    moveDown() {
        let map_move = this.model.move();
        
        this.moveMap(map_move, () => {
        });
        this.padMap();
    },

    moveMap(map, cb) {
        let total = 0;
        for (let i = 0, t; i < this.CFG.ROW; i++) {
            for (let j = 0; j < this.CFG.COLUMN; j++) {
                t = map[i][j];
                if (t) {
                    this.setRelativeJointActive(i, j, false);
                    
                    total++;
                    this.move(i, j, t.r, t.c, () => {
                        (--total) === 0 && cb();
                    });
                    this.cube_list[t.r][t.c] = this.cube_list[i][j];
                    this.cube_list[i][j] = null;
                }
            }
        }

        total === 0 && cb();
    },

    move(i, j, r, c, cb) {
        let cube = this.cube_list[i][j];
        if (cube) {
            let dis = Math.abs(i - r) + Math.abs(j - c);
            cube.runAction(cc.sequence(cc.moveTo(dis * 0.05, this.getCubePosition(r, c)), cc.callFunc(()=>{
                cb && cb();
            })));
        }
        else {
            cb && cb();
        }
    },

    padMap() {
        let num = 0;
        let data = this.model.pad();
        let map = this.model.map;
        let map_num = this.model.num;
        data.forEach(p => {
            num++;
            let dis = this.CFG.ROW - p.r;
            let cube = this.createCube(this.CFG.ROW, p.c, map[p.r][p.c], map_num[p.r][p.c]);
            cube.runAction(cc.sequence(
                cc.moveTo(dis * 0.1, this.getCubePosition(p.r, p.c)),
                cc.callFunc(()=>{
                    (--num) === 0 && (this.padComplete());
                })
            ));
            this.cube_list[p.r][p.c] = cube;
            this.nd_map.addChild(cube, 1);
        });
    },

    padComplete() {
        //突破
        if (this.is_need_breakout) {
            this.is_need_breakout = false;

            this.breakout();
        }
        else {
            this.checkOver();
        }
    },

    prepareBreakout() {
        let n = this.click_num;
        n = n % 2 === 1 ? n + 1 : n;

        let n_list = [], h;
        while(n > 0) {
            h = n / 2;
            if (h >= this.CFG.COLUMN) {
                n_list.push(this.CFG.COLUMN);
                n -= h;
            }
            else {
                n_list.push(h + 1);
                n_list.push(h - 1);
                n = 0;
            }
        }

        let m0 = n_list[0], l, r;
        l = this.click_dst_c - Math.floor((m0 - (m0 % 2 ? 0 : 1)) / 2);
        r = this.click_dst_c + Math.floor(m0 / 2);
        if (l < 0) {
            r = r - l;
            l = 0;
        }
        if (r >= this.CFG.COLUMN)  {
            l = l - (r - this.CFG.COLUMN + 1);
            r = this.CFG.COLUMN - 1;
        }
        let c = Math.floor((l + r) / 2);

        let i = 0, cur_r = this.click_dst_r;
        let ret_list = [];

        let dispose = (i) => {
            l = c - Math.floor((n_list[i] - 1) / 2);
            r = l + n_list[i];
            for (let j = l; j < r; j++) {
                ret_list.push({ r: cur_r, c: j });
            }
        };

        while(i < n_list.length && cur_r >= 0) {
            dispose(i);
            i++;
            cur_r--;
        }
        cur_r = this.click_dst_r + 1;
        while(i < n_list.length) {
            dispose(i);
            i++;
            cur_r++;
        }

        return ret_list;
    },

    breakout() {
        let list = this.prepareBreakout();

        this.model.signNone(list);

        let num = list.length;
        list.forEach(p => {
            let cube = this.cube_list[p.r][p.c];
            if (cube) {
                let c = this.CFG.COLOR[this.CFG.DARK];
                cube.runAction(cc.sequence(
                    cc.spawn(
                        cc.tintTo(0.5, c.r, c.g, c.b), cc.fadeOut(0.5),
                        cc.sequence(cc.scaleTo(0.25, 1.1), cc.scaleTo(0.25, 0.6)),
                    ),
                    cc.callFunc(()=>{
                        this.poolinstance.putCube(cube);
                        this.cube_list[p.r][p.c] = null;
                        (--num) === 0 && (this.moveDown());
                    })
                ));
            }
        });
    },

    checkOver() {
        this.erase_enabled = true;

        this.setJointActive();

        if (this.model.checkOver()) {
            ya.event.emit(ya.ekey.EVT_GAME_OVER);
        }
    },

    runLikeAction(num) {
        // let lpnode;
        if (num >= ya.const.LIKE.UNION_SUPERSTAR) {
            ya.music.playEffect(ya.res.sound_like_3);
            // lpnode = lpinstance.get({ str: ya.txt.str_017 });
        }
        else if (num >= ya.const.LIKE.UNION_PERFECT) {
            ya.music.playEffect(ya.res.sound_like_2);
            // lpnode = lpinstance.get({ str: ya.txt.str_016 });
        }
        else if (num >= ya.const.LIKE.UNION_COOL) {
            ya.music.playEffect(ya.res.sound_like_1);
            // lpnode = lpinstance.get({ str: ya.txt.str_015 });
        }
        // lpnode && (this.node.addChild(lpnode), lpinstance.run(lpnode));
    },

    getJointPosition(i, j, d) {
        let p = this.getCubePosition(i, j);

        if (d === 0) {
            p.x += (this.CFG.WIDTH + this.CFG.GAP) * 0.5;
        }
        else {
            p.y += (this.CFG.WIDTH + this.CFG.GAP) * 0.5;
        }
        return p;
    },

    createCube(i, j, c, n) {
        let cube = this.poolinstance.getCube({
            num: n,
            color: this.CFG.COLOR[c],
            url: ya.tex.game_cube_fillet,
            size: cc.size(this.CFG.WIDTH, this.CFG.WIDTH),
        });
        cube.scale = 1.0;
        cube.opacity = 255;
        cube.position = this.getCubePosition(i, j);

        return cube;
    },

    createJoint(i, j, c, d) {
        let w = d === 0 ? this.CFG.GAP * 3 : this.CFG.WIDTH;
        let h = d === 0 ? this.CFG.WIDTH : this.CFG.GAP * 3;
        let joint = this.poolinstance.getCube({
            num: 0,
            color: this.CFG.COLOR[c],
            url: ya.tex.game_cube_square,
            size: cc.size(w, h),
        });
        joint.position = this.getJointPosition(i, j, d);

        return joint;
    },

    initJoint() {
        this.joint_list = [];
        for (let i = 0, t; i < this.CFG.ROW; i++) {
            this.joint_list[i] = [];
            for (let j = 0; j < this.CFG.COLUMN; j++) {
                t = this.joint_list[i][j] = [];
                if (j < this.CFG.COLUMN - 1) {
                    t[0] = this.createJoint(i, j, this.CFG.RED, 0);
                    this.nd_map.addChild(t[0]);
                }
                if (i < this.CFG.ROW - 1) {
                    t[1] = this.createJoint(i, j, this.CFG.RED, 1);
                    this.nd_map.addChild(t[1]);
                }
            }
        }
    },

    refreshMap() {
        let n = this.model.num;
        let d = this.model.map;
        for (let i = 0; i < this.CFG.ROW; i++) {
            this.cube_list[i] = [];
            for (let j = 0; j < this.CFG.COLUMN; j++) {
                this.cube_list[i][j] = this.createCube(i, j, d[i][j], n[i][j]);
                this.nd_map.addChild(this.cube_list[i][j], 1);
            }
        }
    },

    setJointActive() {
        let d = this.model.map;

        for (let i = 0, t; i < this.CFG.ROW; i++) {
            for (let j = 0; j < this.CFG.COLUMN; j++) {
                t = this.joint_list[i][j];
                t[0] && (t[0].active = false);
                t[1] && (t[1].active = false);
            }
        }

        for (let i = 0, t, r, c; i < this.CFG.ROW; i++) {
            for (let j = 0; j < this.CFG.COLUMN; j++) {
                let num = 0;
                for (let k = 0; k < 4 && d[i][j] !== this.CFG.NONE; k++) {
                    r = i + this.CFG.DIR[k].x;
                    c = j + this.CFG.DIR[k].y;
                    if (r >= 0 && r < this.CFG.ROW && c >= 0 && c < this.CFG.COLUMN) {
                        d[r][c] === d[i][j] && (num++);
                    }
                }

                t = this.joint_list[i][j];
                if (num >= 2) {
                    if (j + 1 < this.CFG.COLUMN && t[0]) {
                        t[0].active = d[i][j] === d[i][j + 1];
                        t[0].color = this.CFG.COLOR[d[i][j]];
                    }
                    if (i + 1 < this.CFG.ROW && t[1]) {
                        t[1].active = d[i][j] === d[i + 1][j];
                        t[1].color = this.CFG.COLOR[d[i][j]];
                    }
                    if (i - 1 >= 0 && this.joint_list[i - 1][j][1]) {
                        this.joint_list[i - 1][j][1].active = d[i][j] === d[i - 1][j];
                        this.joint_list[i - 1][j][1].color = this.CFG.COLOR[d[i][j]];
                    }
                    if (j - 1 >= 0 && this.joint_list[i][j - 1][0]) {
                        this.joint_list[i][j - 1][0].active = d[i][j] === d[i][j - 1];
                        this.joint_list[i][j - 1][0].color = this.CFG.COLOR[d[i][j]];
                    }
                }
            }
        }
    },
    setRelativeJointActive(r, c, active) {
        let t = this.joint_list[r][c], t0, t1;
        let d = this.model.map;
        
        t[0] && (t[0].active = false);
        t[1] && (t[1].active = false);
        
        if (r - 1 >= 0) {
            if (t1 = this.joint_list[r - 1][c][1]) {
                t1.active = false;
            }
        }
        if (c - 1 >= 0) {
            if (t0 = this.joint_list[r][c - 1][0]) {
                t0.active = false;
            }
        }
    },

    setAllJointActive(active) {
        for (let i = 0, t; i < this.CFG.ROW; i++) {
            for (let j = 0; j < this.CFG.COLUMN; j++) {
                t = this.joint_list[i][j];
                t[0] && (t[0].active = active);
                t[1] && (t[1].active = active);
            }
        }
    },
});
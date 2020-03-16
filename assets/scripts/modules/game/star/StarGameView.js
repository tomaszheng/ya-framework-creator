
let AbstractGameView = require("../AbstractGameView");

let SC = require("../../../configs/game/StarConfig");
let SP = require("./StarPool");
let LP = require("../components/LikePool");
let lpinstance = LP.getInstance();

cc.Class({
    extends: AbstractGameView,

    properties: {
        nd_map: cc.Node,
        nd_item: cc.Node,
        lbl_cur_level: cc.Node,
        lbl_cur_score: cc.Node,
        lbl_goal_score: cc.Node,

        lbl_next_level: cc.Node,
        lbl_next_goal: cc.Node,
        nd_award: cc.Node,
        lbl_award: cc.Node,
        lbl_residue: cc.Node,

        _is_played_via_sound: false,
        _is_have_archive: false,
    },

    initData(params) {

        this._super(params);

        this.model = this.model;

        this.CFG = SC;

        this.poolinstance = SP.getInstance();

        let data = ya.storage.obj(ya.skey.STAR_ARCHIVE);
        if (data && data.l > 0) {
            this._is_have_archive = true;

            this.model.parse(data);
        }
        else {
            this.model.restart();
        }

        this.cur_show_score = 0; //当前显示的得分
        this.dst_show_score = 0;
        this.per_show_score = 0;

        this.is_item_award_enabled = true;
        this.item_award_score = this.CFG.ITEM_AWARD_SCORE;

        this.lbl_via = null;
        this.action_score_change = null;
    },

    initUI() {
        this._super();

        if (this._is_have_archive) {
            this.initUIWithArchive();
        }
        else {
            this.scheduleOnce(() => {
                this.nextLevel();
            }, 0.5);
        }
    },

    initUIWithArchive() {
        this.nd_award.active = false;

        this._is_played_via_sound = false;

        this.refreshMapSimply();

        let over = this.model.checkRoundOver();
        if (over.r === -1) { //结束
            this.erase_enabled = false;
            this.settle();
        }
        else {
            this.prompt();
            this.erase_enabled = true;
        }

        this.onGoalChange({ goal: this.model.goal });
        this.onScoreChange({ score: this.model.score });
        this.onLevelChange({ level: this.model.level });
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

    nextLevel() {
        this.model.next();

        this.erase_enabled = false;
        this.nd_award.active = false;

        this._is_played_via_sound = false;

        this.runNextAction(()=>{
            this.refreshMap();
    
            this.prompt();

            this.showItemView(2);
        });

        if (this.lbl_via) {
            lpinstance.put(this.lbl_via);
            this.lbl_via = null;
        }
    },

    revive() {
        this._super();
        
        this.nextLevel();
    },

    restart() {
        this._super();

        this.cur_show_score = 0;
        this.dst_show_score = 0;
        this.per_show_score = 0;

        this.is_item_award_enabled = true;
        this.item_award_score = this.CFG.ITEM_AWARD_SCORE;

        this.nextLevel();
    },

    createCube(i, j, c) {
        let cube = this.poolinstance.getCube({
            scale: 0.5,
            opacity: 0,
            color: c,
            url: ya.tex.game_cube_fillet,
            size: cc.size(this.CFG.WIDTH, this.CFG.WIDTH),
        });
        cube.position = this.getCubePosition(i, j);

        return cube;
    },

    refreshMap() {
        let map_data = this.model.map;
        
        let in_played = false, num = 0;
        for (let i = 0, cube; i < this.CFG.ROW; i++) {
            this.cube_list[i] = [];
            for (let j = 0; j < this.CFG.COLUMN; j++) {
                if (map_data[i][j] !== this.CFG.NONE) {
                    num++;
                    cube = this.createCube(i, j, map_data[i][j]);
                    cube.runAction(cc.sequence(
                        cc.delayTime(i * 0.1),
                        cc.callFunc(() => {
                            !in_played && (in_played = true, ya.music.playEffect(ya.res.sound_star_fadein));
                        }),
                        cc.spawn(cc.fadeIn(0.2), cc.scaleTo(0.2, 1.0)),
                        cc.callFunc(() => {
                            (--num) === 0 && (this.erase_enabled = true);
                        })
                    ));
                    this.nd_map.addChild(cube);
                    this.cube_list[i][j] = cube;
                }
            }
        }
    },

    onClickMap(r, c) {
        if (!this.cube_list[r][c]) return;

        let ret = this.model.bfs(r, c);
        if (ret.length > 1) {
            this.unprompt();
            this.unblink();

            this.erase(ret);
        }
    },

    erase(list) {
        this.model.signNone(list);

        this.erase_enabled = false;

        let len = list.length;
        list.forEach((p, i) => {
            let cube = this.cube_list[p.r][p.c];
            if (!cube) return;
            
            cube.runAction(cc.sequence(
                cc.delayTime(i * 0.05), 
                cc.callFunc(() => {
                    this.pushScore(i, cube.position);
                    ya.music.playEffect(ya.res.sound_star_erase);
                    this.runLikeAction(i);
                }), 
                cc.spawn(cc.fadeOut(0.1), cc.scaleTo(0.1, 0.5)), 
                cc.callFunc(() => {
                    this.poolinstance.putCube(cube);
                    this.cube_list[p.r][p.c] = null;
                    (--len) === 0 && (this.moveDown());
                })));
        });
    },

    moveDown() {
        let map = this.model.moveDown();
        this.moveMap(map, () => {
            this.moveLeft();
        });
    },

    moveLeft() {
        let map = this.model.moveLeft();
        this.moveMap(map, () => {
            let over = this.model.checkRoundOver();
            if (over.r === -1) { //结束
                this.scheduleOnce(()=>{
                    this.settle();
                }, 0.5)
            }
            else {
                this.prompt();

                this.erase_enabled = true;
            }
        });
    },

    moveMap(map, cb) {
        let total = 0;
        for (let i = 0, t; i < this.CFG.ROW; i++) {
            for (let j = 0; j < this.CFG.COLUMN; j++) {
                t = map[i][j];
                if (t) {
                    total++;
                    this.moveCube(i, j, t.r, t.c, () => {
                        (--total) === 0 && cb();
                    });
                    this.cube_list[t.r][t.c] = this.cube_list[i][j];
                    this.cube_list[i][j] = null;
                }
            }
        }

        total === 0 && cb();
    },

    moveCube(i, j, r, c, cb) {
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

    pushScore(i, p) {
        let num = this.CFG.SCORE + this.CFG.SCORE_INC * i;
        let score = this.poolinstance.getScore("+" + num);
        score.position = p;
        score.runAction(cc.sequence(
            cc.moveTo(0.2, cc.v2(p.x, p.y + 50)),
            cc.delayTime(0.5),
            cc.callFunc(() => {
                this.poolinstance.putScore(score);
            })));
        this.nd_map.addChild(score);

        this.model.addScore(num);
    },

    onLevelChange(params) {
        let s = cc.js.formatStr(ya.txt.star_001, params.level);
        this.lbl_cur_level.getComponent(cc.Label).string = s;
    },
    onScoreChange(params) {
        this.dst_show_score = params.score;
        this.per_show_score = Math.ceil((this.dst_show_score - this.cur_show_score) / 5);

        if (!this.action_score_change) {
            this.action_score_change = this.lbl_cur_score.runAction(cc.repeatForever(cc.sequence(
                cc.callFunc(()=>{
                    if (Math.abs(this.cur_show_score - this.dst_show_score) <= Math.abs(this.per_show_score)) {
                        this.cur_show_score = this.dst_show_score;

                        this.action_score_change = null;
                        this.lbl_cur_score.stopAllActions();
                    }
                    else {
                        this.cur_show_score += this.per_show_score;
                    }
                    
                    this.lbl_cur_score.getComponent(cc.Label).string = this.cur_show_score.toString();
                }),
                cc.scaleTo(0.1, 1.2),
                cc.scaleTo(0.1, 1.0),
            )));
        }

        if (!this._is_played_via_sound && params.score >= this.model.goal) {
            this._is_played_via_sound = true;
            ya.music.playEffect(ya.res.sound_star_via);
            this.runViaAction();
        }
    },
    onGoalChange(params) {
        let s = cc.js.formatStr(ya.txt.star_002, params.goal);
        this.lbl_goal_score.getComponent(cc.Label).string = s;
    },

    settle() {
        this.nd_award.active = true;

        let residue_num = this.model.residue_num;
        this.lbl_residue.getComponent(cc.Label).string = cc.js.formatStr(ya.txt.star_004, residue_num);
        this.lbl_award.getComponent(cc.Label).string = cc.js.formatStr(ya.txt.star_003, this.CFG.AWARD);

        let num = 0;
        let map = this.model.map;
        for (let j = 0; j < this.CFG.COLUMN; j++) {
            for (let i = this.CFG.ROW - 1; i >= 0; i--) {
                if (map[i][j] !== this.CFG.NONE) {
                    num++;
                    this.runAwardAction(i, j, num, (n)=>{
                        if (n === num) {
                            //最后一个
                            this.updateAward(num);
                        }
                    });
                }
            }
        }
        if (num === 0) {
            this.updateAward(0);
        }
    },

    _getAwardScore(n) {
        return this.CFG.AWARD - n * n * 20;
    },

    runAwardAction(i, j, num, cb) {
        let time = num > 10 ? 1 : num * 0.1;
        let cube = this.cube_list[i][j];
        cube.runAction(cc.sequence(
            cc.delayTime(time),
            cc.callFunc(()=>{
                if (num <= 10) {
                    ya.music.playEffect(ya.res.sound_star_award_erase);
                }
                let award = this._getAwardScore(num);
                award < 0 && (award = 0);
                this.lbl_award.getComponent(cc.Label).string = cc.js.formatStr(ya.txt.star_003, award);
            }),
            cc.spawn(cc.fadeOut(0.2), cc.scaleTo(0.5)), 
            cc.callFunc(()=>{
                this.poolinstance.putCube(cube);
                this.cube_list[i][j] = null;

                cb && cb(num);
            })
        ));
    },

    updateAward(num) {
        let award = this._getAwardScore(num);
        award < 0 && (award = 0);

        let award_complete = () => {
            let over = this.model.checkGameOver();
            if (!over) {
                this.nextLevel();
            }
            else {
                ya.event.emit(ya.ekey.EVT_GAME_OVER);
            }
            this.nd_award.active = false;
        };

        if (award > 0) {
            let dst_p = this.lbl_cur_score.parent.convertToWorldSpaceAR(this.lbl_cur_score.position);
            let cur_p = this.lbl_award.parent.convertToWorldSpaceAR(this.lbl_award.position);
            let pre_award = Math.ceil(award / 10);
            for(let i = 0; i < 10; i++) {
                let nd_add = this.poolinstance.getScore("+" + pre_award);
                nd_add.scale = 2.0;
                nd_add.position = cur_p;
                nd_add.opacity = 0;
                nd_add.runAction(cc.sequence(
                    cc.delayTime(i * 0.2),
                    cc.callFunc(() => {
                        award -= pre_award;
                        award < 0 && (award = 0);
                        this.lbl_award.getComponent(cc.Label).string = cc.js.formatStr(ya.txt.star_003, award);
                    }),
                    cc.spawn(cc.moveBy(0.2, cc.v2(0, 50)), cc.fadeIn(0.2)),
                    cc.callFunc(()=>{
                        this.model.addScore(pre_award);
                    }),
                    cc.spawn(cc.scaleTo(1, 1.0), cc.moveTo(1, dst_p)),
                    cc.callFunc(()=>{
                        this.poolinstance.putScore(nd_add);
                        (i === 9) && (award_complete());
                    })
                ));
                this.node.addChild(nd_add);
            }
        }
        else {
            this.nd_award.runAction(cc.sequence(
                cc.delayTime(0.5),
                cc.callFunc(() => {
                    award_complete();
                })
            ));
        }

    },

    blink() {
        let over = this.model.checkRoundOver();
        if (over.x !== -1) {
            let list = this.model.bfs(over.r, over.c);
            if (list.length > 0) {
                list.forEach(p => {
                    if (this.cube_list[p.r][p.c]) {
                        this.cube_list[p.r][p.c].runAction(cc.repeatForever(cc.sequence(
                            cc.scaleTo(0.5, 0.7),
                            cc.scaleTo(0.5, 1.0)
                        )));
                    }
                });
            }
        }
    },
    unblink() {
        for (let i = 0; i < this.CFG.ROW; i++) {
            for (let j = 0; j < this.CFG.COLUMN; j++) {
                if (this.cube_list[i][j]) {
                    this.cube_list[i][j].stopAllActions();
                    this.cube_list[i][j].opacity = 255;
                    this.cube_list[i][j].scale = 1.0;
                }
            }
        }
    },

    runNextAction(cb) {
        this.lbl_next_goal.active = true;
        this.lbl_next_level.active = true;
        this.lbl_next_goal.x = -0.5 * cc.winSize.width;
        this.lbl_next_level.x = 1.5 * cc.winSize.width;
        this.lbl_next_goal.y = 0.6 * cc.winSize.height - 50;
        this.lbl_next_level.y = 0.6 * cc.winSize.height;
        this.lbl_next_goal.scale = this.lbl_next_level.scale = 1.0;

        let sgoal = cc.js.formatStr(ya.txt.star_002, this.model.goal);
        this.lbl_next_goal.getComponent(cc.Label).string = sgoal;

        let slevel = cc.js.formatStr(ya.txt.star_001, this.model.level);
        this.lbl_next_level.getComponent(cc.Label).string = slevel;

        let sp = this.lbl_goal_score.position;
        let sszie = this.lbl_goal_score.getContentSize();
        sp.x += sszie.width * 0.5;
        sp = this.lbl_goal_score.parent.convertToWorldSpaceAR(sp);
        this.lbl_next_goal.stopAllActions();
        this.lbl_next_goal.runAction(cc.sequence(
            cc.moveBy(0.5, cc.v2(cc.winSize.width, 0)),
            cc.delayTime(0.5),
            cc.spawn(cc.moveTo(0.6, sp), cc.scaleTo(0.6, 0.7)),
            cc.callFunc(()=>{
                this.lbl_next_goal.active = false;
                cb && cb();
            })
        ));

        let lp = this.lbl_cur_level.position;
        let lszie = this.lbl_next_level.getContentSize();
        lp.x += lszie.width * 0.5;
        lp = this.lbl_cur_level.parent.convertToWorldSpaceAR(lp);
        this.lbl_next_level.stopAllActions();
        this.lbl_next_level.runAction(cc.sequence(
            cc.moveBy(0.5, cc.v2(-cc.winSize.width, 0)),
            cc.delayTime(0.5),
            cc.spawn(cc.moveTo(0.6, lp), cc.scaleTo(0.6, 0.7)),
            cc.callFunc(()=>{
                this.lbl_next_level.active = false;
            })
        ));
    },

    onClickItemMix() {
        if (!this.erase_enabled) return;

        this._super();

        let num = 0;
        let map = this.model.map;
        let mix_cube = (cube, color) => {
            cube.runAction(cc.sequence(
                cc.spawn(cc.scaleTo(0.3, 0.8), cc.fadeTo(0.3, 100), cc.rotateBy(0.3, 180)),
                cc.callFunc(()=>{
                    this.poolinstance.setSpriteFrame(cube, color);
                }),
                cc.spawn(cc.scaleTo(0.2, 1), cc.fadeIn(0.2), cc.rotateBy(0.2, 180)),
                cc.callFunc(()=>{
                    if ((--num) === 0) {
                        this.erase_enabled = true;
                        this.prompt();
                    }
                })
            ));
        };

        for (let i = 0; i < this.CFG.ROW; i++) {
            for (let j = 0; j < this.CFG.COLUMN; j++) {
                if (map[i][j] !== this.CFG.NONE && this.cube_list[i][j]) {
                    num++;
                    mix_cube(this.cube_list[i][j], map[i][j]);
                }
            }
        }
    },

    useItemDye(params) {
        this._super(params);

        let r = params.r;
        let c = params.c;
        let color = params.color;

        let pre_cube = this.cube_list[r][c];
        let y = pre_cube.y, x = pre_cube.x;
        let now_cube = this.createCube(r, c, color);
        now_cube.scale = 1.0;
        now_cube.opacity = 255;
        now_cube.position = cc.v2(cc.winSize.width, y);
        this.nd_map.addChild(now_cube);

        pre_cube.zIndex = 1;
        pre_cube.runAction(cc.sequence(
            cc.jumpTo(1, -50, y, 100, 3).easing(cc.easeIn(2)),
            cc.callFunc(()=>{
                this.poolinstance.putCube(pre_cube);
                this.cube_list[r][c] = null;
            })
        ));
        now_cube.runAction(cc.sequence(
            cc.jumpTo(1, x, y, 100, 3).easing(cc.easeIn(2)),
            cc.callFunc(()=>{
                this.cube_list[r][c] = now_cube;

                this.erase_enabled = true;

                this.prompt();
            })
        ));
    },

    runBombAction(r, c, cb) {
        let cur_cube = this.cube_list[r][c];
        let randx = (Math.random() + 0.5) * 100;
        let randy = (Math.random() + 0.5) * 150;
        let randh = (Math.random() + 0.5) * 80;
        for (let i = 0, x, y; i < 4; i++) {
            let cube = this.createCube(r, c, this.CFG.RED);
            cube.color = cur_cube.color;
            cube.opacity = 255;
            x = this.CFG.WIDTH * 0.5;
            y = this.CFG.WIDTH * 0.5;
            cube.x += i < 2 ? -x : x;
            cube.y += i % 2 === 0 ? y : -y;
            this.nd_map.addChild(cube);

            cube.runAction(cc.sequence(
                cc.spawn(
                    cc.fadeOut(1),
                    cc.scaleTo(1, 0.6),
                    cc.jumpBy(1, i < 2 ? -randx : randx, -randy, randh, 1)
                ).easing(cc.easeSineIn(2)),
                cc.callFunc(() => {
                    this.poolinstance.putCube(cube);
                    cb && cb();
                })
            ));
        }
        
        this.poolinstance.putCube(this.cube_list[r][c]);
        this.cube_list[r][c] = null;
    },

    runViaAction() {
        let dst_p = this.lbl_goal_score.parent.convertToWorldSpaceAR(this.lbl_goal_score.position);
        dst_p.x += 80; dst_p.y += 20;
        let node = lpinstance.get({ str: ya.txt.str_014, color: cc.color(255, 0, 255) });
        node.position = cc.v2(cc.winSize.width*0.5, cc.winSize.height*0.5);
        node.opacity = 0;
        node.runAction(cc.sequence(
            cc.spawn(cc.fadeIn(0.1), cc.sequence(cc.scaleTo(0.1, 1.1), cc.scaleTo(0.1, 0.9), cc.scaleTo(0.1, 1.0))),
            cc.spawn(cc.moveTo(0.5, dst_p).easing(cc.easeIn(2)), cc.scaleTo(0.5, 0.5), cc.rotateTo(0.5, -15))
        ));
        this.node.addChild(node);
        this.lbl_via = node;
    },

    runLikeAction(i) {
        let lpnode;
        if (i + 1 === ya.const.LIKE.COOL) {
            lpnode = lpinstance.get({ str: ya.txt.str_015 });
            ya.music.playEffect(ya.res.sound_like_1);
        }
        else if (i + 1 === ya.const.LIKE.PERFECT) {
            lpnode = lpinstance.get({ str: ya.txt.str_016 });
            ya.music.playEffect(ya.res.sound_like_2);
        }
        else if (i + 1 === ya.const.LIKE.SUPERSTAR) {
            lpnode = lpinstance.get({ str: ya.txt.str_017 });
            ya.music.playEffect(ya.res.sound_like_3);

            this.showItemView(1);
        }
        lpnode && (this.node.addChild(lpnode), lpinstance.run(lpnode));
    },

    setNextGoalRewardScore() {
        this.goal_award_score += this.CFG.GOAL_AWARD_SCORE_INC;
    },
});
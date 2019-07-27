
let View = require("../../components/mvc/View");

let Item = require("../../widgets/Item");

cc.Class({
    extends: View,

    properties: {

        btn_pause: cc.Node,

        _is_erase_enabled: false,
        erase_enabled: {
            visible: false,
            set(enabled) {
                this._is_erase_enabled = enabled;
            },
            get() {
                return this._is_erase_enabled;
            }
        },
    },

    // override
    initData(params) {
        this.model = ya.model.game.star;

        this.erase_enabled = false;

        this.poolinstance = null;

        //此模式的特有配置
        this.CFG = {};

        this.cube_list = [];

        this.item_map = {};

        this.goal_award_score = this.CFG.GOAL_AWARD_SCORE;
    },

    // override
    initUI() {

        this.initItemList();

    },

    // override
    initEvent() {
        this.model.on(ya.ekey.MD_GAME_GOAL_CHANGE, this.onGoalChange, this);
        this.model.on(ya.ekey.MD_GAME_LEVEL_CHANGE, this.onLevelChange, this);
        this.model.on(ya.ekey.MD_GAME_SCORE_CHANGE, this.onScoreChange, this);
        ya.model.item.on(ya.ekey.MD_ITEM_NUM_CHANGE, this.onItemNumChange, this);
    },

    initClick() {
        ya.utils.addClickEvent(this.btn_pause, ()=>{
            ya.event.emit(ya.ekey.EVT_SHOW_PAUSE, {
                restart_cb: ()=>{
                    this.restart();
                }
            });
        });
    },

    // override
    getEnabledItemMode() {
        return [ya.const.ITEM_MODE.MIX, ya.const.ITEM_MODE.DYE, ya.const.ITEM_MODE.BOMB];
    },
    initItemList() {
        let mode_list = this.getEnabledItemMode();

        let x = -0.5 * (mode_list.length - 1) * 200;
        for (let i = 0, item; i < mode_list.length; i++) {
            item = new Item();
            item.init({
                power: true,
                mode: mode_list[i],
                num: ya.model.item.getItemNum(mode_list[i]),
                click_cb: (mode) => {
                    this.onClickItem(mode);
                }
            });
            item.x = x;
            this.nd_item.addChild(item);
            this.item_map[mode_list[i]] = item;
            x += 200;
        }
    },

    // override
    revive() {
        this.model.revive();
    },

    // override
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

        this.goal_award_score = this.CFG.GOAL_AWARD_SCORE;
    },

    // override
    createCube() {

    },

    // override
    refreshMap() {

    },
    // override
    refreshMapSimply() {
        let d = this.model.map;

        let cubes = this.cube_list = [];
        for (let i = 0, cube; i < this.CFG.ROW; i++) {
            cubes[i] = [];
            for (let j = 0; j < this.CFG.COLUMN; j++) {
                if (d[i][j] !== this.CFG.NONE) {
                    cube = this.createCube(i, j, d[i][j]);
                    cube.scale = 1.0;
                    cube.opacity = 255;
                    this.nd_map.addChild(cubes[i][j] = cube);
                }
            }
        }
    },

    getCubeIndex(p) {
        p = this.nd_map.convertToNodeSpace(p);

        p.y -= this.CFG.BORDER - this.CFG.GAP;
        p.x -= this.CFG.BORDER - this.CFG.GAP;

        if (p.y < 0 || p.x < 0) {
            return { r: -1, c: -1 };
        }

        let n = this.CFG.WIDTH + this.CFG.GAP;

        let r = ~~(p.y / n), c = ~~(p.x / n);
        
        r >= this.CFG.ROW && (r = -1);
        c >= this.CFG.COLUMN && (c = -1);

        return { r: r, c: c };
    },

    getCubePosition(i, j) {
        let x = this.CFG.BORDER + j * (this.CFG.GAP + this.CFG.WIDTH) + this.CFG.WIDTH * 0.5;
        let y = this.CFG.BORDER + i * (this.CFG.GAP + this.CFG.WIDTH) + this.CFG.WIDTH * 0.5;
        return cc.v2(x, y);
    },

    // override
    erase() {

    },
    // override
    moveDown() {

    },
    // override
    moveLeft() {

    },
    // override
    moveMap() {

    },
    // override
    moveCube() {

    },

    // override
    // add score
    pushScore(score) {

    },

    // override
    settle() {

    },

    // override
    prompt() {
        this.unprompt();
        this.scheduleOnce(this.blink, 5);
    },
    // override
    unprompt() {
        this.unschedule(this.blink);
    },
    // override
    blink() {
        
    },
    // override
    unblink() {
        
    },
    // override
    onClickMap(r, c) {
        if (!this.cube_list[r][c]) return;
    },

    onClickItem(mode) {
        let num = ya.model.item.getItemNum(mode);
        if (num > 0) {
            switch (mode) {
                case ya.const.ITEM_MODE.MIX:
                    this.onClickItemMix(); break;
                case ya.const.ITEM_MODE.DYE:
                    this.onClickItemDye(); break;
                case ya.const.ITEM_MODE.BOMB:
                    this.onClickItemBomb(); break;
            }
        }
        else {
            let got_mode = this.model.getItemGotMode();
            ya.event.emit(ya.ekey.EVT_GAME_ITEM_LACK, { mode: mode, got_mode: got_mode });
        }
    },

    onClickItemMix() {
        if (!this.erase_enabled) return;

        this.erase_enabled = false;

        this.unblink();
        this.unprompt();

        this.model.mix();

        ya.model.item.addItemNum(ya.const.ITEM_MODE.MIX, -1);
    },
    onClickItemDye() {
        if (!this.erase_enabled) return;

        let prefab = cc.loader.getRes(ya.res.prefab_game_star_item);
        let script = cc.instantiate(prefab).addComponent("StarItemView");
        script.init({
            mode: ya.const.ITEM_MODE.DYE
        });
        this.node.addChild(script.node);
    },
    onClickItemBomb() {
        if (!this.erase_enabled) return;

        let prefab = cc.loader.getRes(ya.res.prefab_game_star_item);
        let script = cc.instantiate(prefab).addComponent("StarItemView");
        script.init({
            mode: ya.const.ITEM_MODE.BOMB
        });
        this.node.addChild(script.node);
    },
    onClickPause() {
        ya.event.emit(ya.ekey.EVT_SHOW_PAUSE, {
            restart_cb: () => {
                this.restart();
            }
        });
    },

    // override
    useItemDye(params) {
        this.erase_enabled = false;

        this.model.dye(params.r, params.c, params.color);

        ya.model.item.addItemNum(ya.const.ITEM_MODE.DYE, -1);

        this.unprompt();
        this.unblink();
    },
    // override
    useItemBomb(params) {
        let r = params.r, c = params.c;

        this.erase_enabled = false;

        this.model.bomb(r, c);

        ya.model.item.addItemNum(ya.const.ITEM_MODE.BOMB, -1);

        this.unprompt();
        this.unblink();
        
        this.runBombAction(r, c, () => {
            this.moveDown();
        });
    },
    // override
    runBombAction() {

    },
    // override
    runLikeAction() {

    },

    onGoalChange(params) {

    },

    onLevelChange(params) {

    },

    onScoreChange(params) {

    },

    onItemNumChange(params) {
        let mode = params.mode;
        let num = ya.model.item.getItemNum(mode);
        let item = this.item_map[mode];
        item.setPower(num);
    },

    // override
    setNextGoalRewardScore() {
        this.goal_award_score += this.CFG.GOAL_AWARD_SCORE_INC;
    },
    // override
    showItemView(action) {
        let mode_list = this.getEnabledItemMode();

        ya.func.mix(mode_list);

        if (action === 2) {
            if (this.model.score >= this.goal_award_score) {
                ya.event.emit(ya.ekey.EVT_GAME_SHOW_ITEM, {
                    action: 2,
                    items: mode_list.splice(0, 2),
                    content: cc.js.formatStr(ya.txt.str_021, this.goal_award_score)
                });
                this.setNextGoalRewardScore();
            }
        }
        else if (action === 1) {
            ya.event.emit(ya.ekey.EVT_GAME_SHOW_ITEM, {
                action: 1,
                items: mode_list.splice(0, 1),
                content: ya.txt.str_020
            });
        }
    },

    runGotItemAction(got_items) {
        let x = -0.5 * (got_items.length - 1) * 200;
        for (let i = 0; i < got_items.length; i++) {
            let item = new Item();
            item.init({
                power: false,
                mode: got_items[i].mode,
                num: got_items[i].num
            });
            item.position = this.nd_item.convertToNodeSpace(cc.v2(x, cc.winSize.height * 0.5));
            item.runAction(cc.sequence(
                cc.moveTo(0.5, this.item_map[got_items[i].mode].position),
                cc.scaleTo(0.2, 1.1),
                cc.scaleTo(0.2, 1.0),
                cc.callFunc(() => {
                    item.destroy();
                })
            ));
            this.nd_item.addChild(item);

            x += 200;
        }
    },

    onDestroy() {
        this.model.targetOff(this);
        ya.model.item.targetOff(this);
    }
});
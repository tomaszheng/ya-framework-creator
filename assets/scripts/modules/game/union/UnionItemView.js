
let View = require("../../../components/mvc/View");

let UC = require("../../../configs/game/UnionConfig");

let CP = require("../components/CubePool");
let cpinstance = CP.getInstance();

cc.Class({
    extends: View,

    properties: {
        nd_mask: cc.Node,
        nd_map: cc.Node,

        lbl_tip: cc.Node,

        btn_cancel: cc.Node,

        container: cc.Node,
    },

    initData(params) {
        this._super(params);

        this.selected_r = -1;
        this.selected_c = -1;
        this.cubes = [];

        this.mode = params.mode || ya.const.ITEM_MODE.DYE;

        this.cancel_cb = params.cancel_cb;
    },

    initUI() {
        this.nd_map = this.node.getChildByName("nd_map");
        this.nd_mask = this.node.getChildByName("nd_mask");

        this.lbl_tip = this.nd_map.getChildByName("lbl_tip");
        this.container = this.nd_map.getChildByName("container");
        this.btn_cancel = this.container.getChildByName("btn_cancel");

        let str = "";
        if (this.mode === ya.const.ITEM_MODE.DYE) {
            str = ya.txt.str_011;
        }
        else {
            str = ya.txt.str_013;
        }
        this.lbl_tip.getComponent(cc.Label).string = str;

        this.runTipAction();
    },

    initClick() {
        ya.utils.addClickEvent(this.btn_cancel, ()=>{
            this.onClickCancel();
        });

        let start_pos, end_pos;
        ya.utils.addTouchEvent(this.nd_map,
            (event)=>{
                end_pos = event.touch.getLocation();
                if (Math.abs(start_pos.x - end_pos.x) < 10 &&
                    Math.abs(start_pos.y - end_pos.y) < 10)
                {
                    this.onClickMap(event.touch);
                }
            },
            (event)=>{

            },
            (event)=>{
                start_pos = event.touch.getLocation();
            });
        
        ya.utils.addClickEvent(this.node, ()=>{
            this.onClickCancel();
        });

    },

    onClickCancel() {

        this.cancel_cb && this.cancel_cb();

        this.node.destroy();
    },

    onClickMap(touch) {
        let rc = this.getCubeIndex(touch.getLocation());

        if (rc.r === -1 || rc.c === -1) return;

        let map_data = ya.model.game.union.map;
        
        if (map_data[rc.r][rc.c] !== UC.NONE) {

            this.selected_r = rc.r;
            this.selected_c = rc.c;

            if (this.mode === ya.const.ITEM_MODE.BOMB) {
                this.onClickBomb();
            }
            else if (map_data[rc.r][rc.c] === UC.DARK) {
                this.container.active = false;
            }
            else {
                this.container.active = true;

                this.resetContainer(rc.r, rc.c, map_data[rc.r][rc.c]);

                this.lbl_tip.getComponent(cc.Label).string = ya.txt.str_012;
            }
        }
        else {
            this.container.active = false;
        }
    },
    onClickDye(color) {
        ya.event.emit(ya.ekey.EVT_GAME_USE_DYE, { 
            r: this.selected_r,
            c: this.selected_c,
            color: color
        });

        this.node.destroy();
    },
    onClickBomb() {
        ya.event.emit(ya.ekey.EVT_GAME_USE_BOMB, {
            r: this.selected_r,
            c: this.selected_c,
        });

        this.node.destroy();
    },

    getCubeIndex(p) {
        p = this.nd_map.convertToNodeSpace(p);

        p.y -= UC.BORDER - UC.GAP;
        p.x -= UC.BORDER - UC.GAP;

        if (p.y < 0 || p.x < 0) {
            return { r: -1, c: -1 };
        }

        let n = UC.WIDTH + UC.GAP;

        let r = ~~(p.y / n), c = ~~(p.x / n);
        
        r >= UC.ROW && (r = -1);
        c >= UC.COLUMN && (c = -1);

        return { r: r, c: c };
    },

    getCubePosition(i) {
        return cc.v2(-60 + i * 120, 0);
    },

    resetContainer(r, c, color) {
        for (let i = 0, j = 0, cube; i < UC.COLOR_LEN; i++) {
            if (UC.COLOR_LIST[i] !== color) {
                cube = this.cubes[j] ? this.cubes[j] : cpinstance.get();
                cube.getComponent("Cube").fill({
                    color: UC.COLOR[UC.COLOR_LIST[i]],
                    color_mode: UC.COLOR_LIST[i],
                    url: ya.tex.game_cube_fillet,
                    size: cc.size(100, 100)
                });
                cube.position = this.getCubePosition(j);
                if (!cube.parent) {
                    ya.utils.addClickEvent(cube, (event)=>{
                        this.onClickDye(event.target.getComponent("Cube").color_mode);
                    });
                    this.container.addChild(cube);
                }
                this.cubes[j++] = cube;
            }
        }

        let size = this.container.getContentSize();
        let x = c * (UC.WIDTH + UC.GAP) + UC.WIDTH * 0.5 + UC.BORDER;
        let y = r * (UC.WIDTH + UC.GAP) + UC.WIDTH * 0.5 + UC.BORDER + size.height;
        if (x < size.width * 0.5) x = size.width * 0.5;
        if (x + size.width * 0.5 > cc.winSize.width) x = cc.winSize.width - size.width * 0.5;
        
        this.container.position = cc.v2(x, y);
    },

    runTipAction() {
        this.lbl_tip.runAction(cc.repeatForever(cc.sequence(
            cc.fadeTo(1, 100),
            cc.fadeIn(1)
        )));
    },
});
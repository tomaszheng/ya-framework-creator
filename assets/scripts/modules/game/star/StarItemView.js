
let View = require("../../../components/mvc/View");

let SC = require("../../../configs/game/StarConfig");
let SP = require("./StarPool");
let spinstance = SP.getInstance();

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

        ya.utils.addClickEvent(this.node, (event) => {
            this.onClickCancel();
        });

    },

    onClickCancel() {
        this.node.destroy();
    },

    onClickMap(touch) {
        let rc = this.getCubeIndex(touch.getLocation());
        let map_data = ya.model.game.star.map;
        
        if (rc.r === -1 || rc.c === -1) return;

        if (map_data[rc.r][rc.c] !== SC.NONE) {

            this.selected_r = rc.r;
            this.selected_c = rc.c;

            if (this.mode === ya.const.ITEM_MODE.BOMB) {
                this.onClickBomb();
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

        p.y -= SC.BORDER - SC.GAP;
        p.x -= SC.BORDER - SC.GAP;

        if (p.y < 0 || p.x < 0) {
            return { r: -1, c: -1 };
        }

        let n = SC.WIDTH + SC.GAP;

        let r = ~~(p.y / n), c = ~~(p.x / n);
        
        r >= SC.ROW && (r = -1);
        c >= SC.COLUMN && (c = -1);

        return { r: r, c: c };
    },

    getCubePosition(i) {
        return cc.v2(-180 + i * 120, 0);
    },

    resetContainer(r, c, color) {
        for (let i = 0, j = 0, cube; i < SC.COLOR_LIST.length; i++) {
            if (SC.COLOR_LIST[i] !== color) {
                cube = this.cubes[j] ? this.cubes[j] : spinstance.getCube();
                spinstance.fill(cube, {
                    color: SC.COLOR_LIST[i],
                    url: ya.tex.game_cube_fillet,
                    size: cc.size(100, 100)
                });
                cube.position = this.getCubePosition(j);
                if (!cube.parent) {
                    ya.utils.addClickEvent(cube, ()=>{
                        this.onClickDye(SC.COLOR_LIST[i]);
                    });
                    this.container.addChild(cube);
                }
                this.cubes[j++] = cube;
            }
        }

        let size = this.container.getContentSize();
        let x = c * (SC.WIDTH + SC.GAP) + SC.WIDTH * 0.5 + SC.BORDER;
        let y = r * (SC.WIDTH + SC.GAP) + SC.WIDTH * 0.5 + SC.BORDER + size.height;
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

let AbstractGameView = require("../AbstractGameView");

let RC = require("../../../configs/game/RussiaConfig");
let RP = require("./RussiaPool");

cc.Class({
    extends: AbstractGameView,

    properties: {
        nd_op: cc.Node,
        nd_map: cc.Node,
        nd_next: cc.Node,

        lbl_cur_score: cc.Node,

        _status: RC.STATUS.NONE,
        status: {
            visible: false,
            get() {
                return this._status;
            },
            set(s) {
                this._status = s;
            }
        },
        _op_valid: true,
        op_valid: {
            get() {
                return this._op_valid;
            },
            set(o) {
                this._op_valid = o;
            }
        }
    },

    initData(params) {
        this._super(params);

        this.model = ya.model.game.russia;

        this.poolinstance = RP.getInstance();

        this.CFG = RC;

        this.shape = null;
        this.dst_shap = null;
        this.next_shape = null;

        this.motions = [];

        this.status = this.CFG.STATUS.NONE;

        for (let i = 0; i < this.CFG.ROW; i++) {
            this.cube_list[i] = [];
        }

        this.model.restart();
    },

    initUI() {
        this.status = this.CFG.STATUS.PLAYING;

        this.schedule(this.iterator, 0.8, cc.macro.REPEAT_FOREVER);

        this.initMapGrid();
        
        this.resetShape();

        this.nd_op.addComponent("TouchHaloAnimation");
    },

    // override
    initItemList() {

    },

    restart() {
        this.status = this.CFG.STATUS.PLAYING;

        for (let i = 0; i < this.CFG.ROW; i++) {
            for (let j = 0; j < this.CFG.COLUMN; j++) {
                if (this.cube_list[i][j]) {
                    this.poolinstance.putCube(this.cube_list[i][j]);
                }
            }
            this.cube_list[i] = [];
        }

        this.putCurShape();

        this.poolinstance.putShape(this.next_shape);

        this.model.restart();
        
        this.resetShape();
    },

    initMapGrid() {
        for (let i = 0; i <= this.CFG.ROW; i++) {
            let node = this.poolinstance.getCube({
                ax: 0, ay: 0,
                opacity: 150,
                size: cc.size(520 - 2 * this.CFG.BORDER + 2, 1)
            });
            node.position = cc.v2(this.CFG.BORDER, this.CFG.BORDER + (this.CFG.WIDTH + this.CFG.GAP) * i - 4);
            this.nd_map.addChild(node);
        }
        for (let j = 0; j <= this.CFG.COLUMN; j++) {
            let node = this.poolinstance.getCube({
                ax: 0, ay: 0,
                opacity: 150,
                size: cc.size(1, 1010 - 2 * this.CFG.BORDER + 2)
            });
            node.position = cc.v2(this.CFG.BORDER + (this.CFG.WIDTH + this.CFG.GAP) * j - 4, this.CFG.BORDER);
            this.nd_map.addChild(node);
        }
    },
    
    initClick() {
        this._super();
        
        let began_pos, began_time, end_time, direction;

        let check_slide = (touch) => {
            let pos = touch.getLocation();
            let abs_x = Math.abs(pos.x - began_pos.x);
            let abs_y = Math.abs(pos.y - began_pos.y);
            if (direction === 0) {
                if (abs_x > 20 && abs_x > 2 * abs_y) {
                    direction = 1;
                    began_pos = pos;
                }
                else if (abs_y > 20 && abs_y > 2 * abs_x) {
                    direction = 2;
                    began_pos = pos;
                }
            }
            else if (direction === 1) {
                let n = Math.floor(abs_x / this.CFG.MOVE_DIS_X);
                if (n > 0) {
                    (pos.x < began_pos.x) && (n = -n);
                    this.opMoveHorizontal(n);
                    began_pos = pos;
                }
            }
            else {
                let n = Math.floor(abs_y / this.CFG.MOVE_DIS_Y);
                if (n > 0 && pos.y < began_pos.y) {
                    this.opMoveVertical(-n);
                    began_pos = pos;
                }
            }
        };

        ya.utils.addTouchEvent(this.nd_op,
            (event) => {
                if (!this.op_valid) return;
                if (this.status !== this.CFG.STATUS.PLAYING) return;
                end_time = new Date().getTime();
                if (direction === 0 && end_time - began_time < 200) {
                    this.opRotate();
                }
            }, (event) => {
                if (!this.op_valid) return;
                if (this.status !== this.CFG.STATUS.PLAYING) return;
                check_slide(event.touch);
            }, (event) => {
                if (this.status !== this.CFG.STATUS.PLAYING) return;
                this.op_valid = true;
                direction = 0;
                began_time = new Date().getTime();
                began_pos = event.touch.getLocation();
            }
        );
    },

    opRotate() {
        this.model.rotateShape();
        
        this.putCurShape();

        this.resetCurShape();
    },
    opMoveHorizontal(num) {
        if (!this.shape) return;

        for (let i = 0, a = num > 0 ? 1 : -1; i !== num; i += a) {
            if (this.model.moveShape(0, a)) {
                let len_x = a * (this.CFG.WIDTH + this.CFG.GAP);
                this.shape.x += len_x;
            }
            else {
                break;
            }
        }

        if (!this.testMoveShape(-1, 0)) {
            this.op_valid = false;
            this.iterator();
        }
        else {
            this.resetDstShapePosition();
        }
    },
    opMoveVertical(num) {
        if (!this.shape) return;

        for (let i = 0, a = num > 0 ? 1 : -1; i !== num; i += a) {
            if (this.model.moveShape(a, 0)) {
                let len_y = a * (this.CFG.WIDTH + this.CFG.GAP);
                this.shape.y += len_y;
            }
            else {
                break;
            }
        }

        if (!this.testMoveShape(-1, 0)) {
            this.op_valid = false;
            this.iterator();
        }
        else {
            this.resetDstShapePosition();
        }
    },

    revive() {
        let list = this.model.revive();
        let num = 0;
        list.forEach(p => {
            let cube = this.cube_list[p.r][p.c];
            if (cube) {
                num++;
                cube.runAction(cc.sequence(
                    cc.fadeOut(0.2),
                    cc.callFunc(()=>{
                        this.poolinstance.putCube(cube);
                        this.cube_list[p.r][p.c] = null;

                        (--num) === 0 && (this.next());
                    })
                ));
            }
        });
    },

    iterator() {
        if (this.status !== this.CFG.STATUS.PLAYING) return;

        let move_enabled = this.model.moveShape(-1, 0);
        if (move_enabled) {
            this.shape.position = this.getShapePosition();
        }
        else {
            this.mapShape();

            let list = this.model.searchHorizontal();
            if (list.length > 0) {
                this.erase(list);
            }
            else {
                if (this.model.checkOver()) {
                    this.status = this.CFG.STATUS.OVER;
                    ya.event.emit(ya.ekey.EVT_GAME_OVER);
                }
                else {
                    this.next();
                }
            }
        }
    },

    erase(list) {
        this.status = this.CFG.STATUS.ERASING;

        this.model.signNone(list);

        let len = list.length;
        list.forEach((r, i) => {
            this.runEraseAction(i * 0.1, r, ()=>{
                this.model.score += (i + 1) * this.CFG.SCORE_INC;
                (--len) === 0 && (this.moveDown());
            });
        });
    },

    moveDown() {
        let num = 0;
        let map = this.model.moveDown();
        for (let i = 0, t = 0, found; i < this.CFG.ROW; i++) {
            found = false;
            for (let j = 0; j < this.CFG.COLUMN; j++) {
                let cube = this.cube_list[i][j];
                let p = map[i][j];
                if (cube && p) {
                    num++, found = true;
                    this.swapCube(i, j, p.r, p.c);
                    cube.runAction(cc.sequence(
                        cc.delayTime(t*0.05),
                        cc.moveTo(0.1, this.getCubePosition(p.r, p.c)),
                        cc.callFunc(()=>{
                            (--num) === 0 && (this.next());
                        })
                    ));
                }
            }
            found && t++;
        }
    },

    next() {
        this.model.next();

        this.poolinstance.putShape(this.next_shape);

        this.resetShape();

        this.status = this.CFG.STATUS.PLAYING;
    },

    runEraseAction(delay_t, r, cb) {
        let dst_pos = this.getCubePosition(r, this.CFG.COLUMN);
        dst_pos.x += this.CFG.WIDTH;

        let num = this.CFG.COLUMN;
        for (let j = 0; j < this.CFG.COLUMN; j++) {
            let t = j * 0.5 / this.CFG.COLUMN;
            let cube = this.cube_list[r][j];
            cube.runAction(cc.sequence(
                cc.delayTime(delay_t + t),
                cc.spawn(cc.moveTo(0.5 - t, dst_pos), cc.fadeOut(0.5 - t)),
                cc.callFunc(()=>{
                    this.cube_list[r][j] = null;
                    this.poolinstance.putCube(cube);
                    (--num) === 0 && cb();
                })
            ))
        }
    },

    swapCube(i, j, r, c) {
        let cube = this.cube_list[i][j];
        this.cube_list[i][j] = this.cube_list[r][c];
        this.cube_list[r][c] = cube;
    },

    testMoveShape(r, c) {
        r = this.model.cur_shape_row + r;
        c = this.model.cur_shape_column + c;
        return this.model.testMove(r, c);
    },

    putCurShape() {
        this.poolinstance.putShape(this.shape);
        this.shape = null;

        this.poolinstance.putShape(this.dst_shape);
        this.dst_shape = null;
    },
    
    resetShape() {
        this.resetCurShape();

        this.next_shape = this.poolinstance.getShape(this.model.next_shape);
        this.next_shape.scale = 0.7;
        this.nd_next.addChild(this.next_shape);
    },

    resetCurShape() {
        this.shape = this.poolinstance.getShape(this.model.cur_shape);
        this.shape.position = this.getShapePosition();
        this.nd_map.addChild(this.shape, 2);

        this.resetDstShape();
    },
    resetDstShape() {
        this.dst_shape = this.poolinstance.getShape(this.model.cur_shape);
        this.dst_shape.opacity = 50;
        this.nd_map.addChild(this.dst_shape, 1);

        this.resetDstShapePosition();
    },
    resetDstShapePosition() {
        this.dst_shape.position = this.getShapePosition(this.model.getDstRow());
    },

    getShapePosition(r, c) {
        let row = r === undefined ? this.model.cur_shape_row : r;
        let column = c === undefined ? this.model.cur_shape_column : c;
        let p = this.getCubePosition(row, column);
        return cc.v2(p.x - 0.5 * this.CFG.WIDTH, p.y - 0.5 * this.CFG.WIDTH);
    },
    getCubePosition(i, j) {
        let x = this.CFG.BORDER + j * (this.CFG.GAP + this.CFG.WIDTH) + 0.5 * this.CFG.WIDTH;
        let y = this.CFG.BORDER + i * (this.CFG.GAP + this.CFG.WIDTH) + 0.5 * this.CFG.WIDTH;
        return cc.v2(x, y);
    },
    getCubeIndex(p) {
        let c = Math.floor((p.x - this.CFG.BORDER) / (this.CFG.GAP + this.CFG.WIDTH));
        let r = Math.floor((p.y - this.CFG.BORDER) / (this.CFG.GAP + this.CFG.WIDTH));
        return {r: r, c: c};
    },

    mapShape() {
        let cur_shape = this.model.cur_shape;
        let table = this.model.mapShape();
        for (let i = 0, cube, p; i < this.CFG.U_ROW; i++) {
            for (let j = 0; j < this.CFG.U_COLUMN; j++) {
                p = table[i][j];
                if (cur_shape[i][j] !== this.CFG.NONE && p) {
                    cube = this.poolinstance.getCube({
                        color: this.CFG.COLOR[cur_shape[i][j] || 1],
                        size: cc.size(this.CFG.WIDTH, this.CFG.WIDTH)
                    });
                    cube.position = this.getCubePosition(p.r, p.c);
                    this.nd_map.addChild(cube);
                    this.cube_list[p.r][p.c] = cube;
                }
            }
        }

        this.putCurShape();
    },

    onClickPause() {
        this.status = this.CFG.STATUS.PAUSE;

        ya.event.emit(ya.ekey.EVT_SHOW_PAUSE, {
            restart_cb: ()=>{
                this.restart();
            },
            continue_cb: ()=>{
                this.status = this.CFG.STATUS.PLAYING;
            }
        });
    },

    onScoreChange(params) {
        this.lbl_cur_score.getComponent(cc.Label).string = params.score.toString();
    },

});
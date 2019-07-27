
let RC = require("../../../configs/game/RussiaConfig");
let CP = require("../components/CubePool");
let cpinstance = CP.getInstance();

let _instance;

let RussiaPool =  cc.Class({
    statics: {
        getInstance() {
            if (!_instance) {
                _instance = new RussiaPool();
            }
            return _instance;
        },
    },

    ctor() {
        this.pool_shape = new cc.NodePool();
        this.pool_motion = new cc.NodePool();
    },

    getCube(params) {
        return cpinstance.get(params);
    },

    putCube(cube) {
        cpinstance.put(cube);
    },

    createShape() {
        let node = new cc.Node();
        node.anchorX = node.anchorY = 0;
        node.setContentSize(cc.size(RC.U_WIDTH, RC.U_WIDTH));
        return node;
    },

    getShape(map) {
        let shape;
        if (this.pool_shape.size() > 0) {
            shape = this.pool_shape.get();
        }
        else {
            shape = this.createShape();
        }
        shape.scale = 1.0;
        shape.opacity = 255;
        shape.position = cc.v2(0, 0);

        for (let i = 0, cube; i < RC.U_ROW; i++) {
            for (let j = 0; j < RC.U_COLUMN; j++) {
                if (map[i][j] !== RC.NONE) {
                    cube = this.getCube({
                        color: RC.COLOR[map[i][j] || 1],
                        size: cc.size(RC.WIDTH, RC.WIDTH)
                    });
                    cube.position = this.getCubePosition(i, j);
                    shape.addChild(cube);
                }
            }
        }

        return shape;
    },

    putShape(shape) {
        if (!shape) return;
        
        while (shape.children.length > 0) {
            this.putCube(shape.children[0]);
        }
        this.pool_shape.put(shape);
    },

    getCubePosition(r, c) {
        let x = c * (RC.GAP + RC.WIDTH) + 0.5 * RC.WIDTH;
        let y = r * (RC.GAP + RC.WIDTH) + 0.5 * RC.WIDTH;
        return cc.v2(x, y);
    },

    getMotion(color) {
        let motion;
        if (this.pool_motion.size() > 0) {
            motion = this.pool_motion.get();
        }
        else {
            motion = new cc.Node();
            let streak = motion.addComponent(cc.MotionStreak);
            streak.fadeTime = 1.0;
            streak.minSeg = 1;
            streak.stroke = RC.WIDTH;
            streak.color = color || cc.color(255, 255, 255);
            streak.texture = cc.loader.getRes(ya.res.global_cube_square);
        }
        return motion;
    },
    putMotion(motion) {
        motion.getComponent(cc.MotionStreak).reset();
        this.pool_motion.put(motion);
    },

});
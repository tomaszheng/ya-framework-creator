/*
方块生成器
*/

let Cube = require("./Cube");

let _instance;

let CubePool = cc.Class({
    statics: {
        getInstance() {
            if (!_instance) {
                _instance = new CubePool();
            }
            return _instance;
        }
    },

    ctor() {
        this.pool = new cc.NodePool();
    },

    get(params) {
        params = params || {};
        let cube;
        if (this.pool.size() > 0) {
            cube = this.pool.get();
            cube.getComponent("Cube").fill(params);
        }
        else {
            cube = new cc.Node();
            let script = cube.addComponent(Cube);
            script.init(params);
        }
        
        return cube;
    },

    put(cube) {
        this.pool.put(cube);
    }
});
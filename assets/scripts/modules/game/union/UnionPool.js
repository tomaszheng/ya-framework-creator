
let CP = require("../components/CubePool");
let cpinstance = CP.getInstance();

let _instance;

let UnionPool = cc.Class({

    statics: {
        getInstance() {
            if (!_instance) {
                _instance = new UnionPool();
            }
            return _instance;
        }
    },

    ctor() {
        this.pool_digit = new cc.NodePool();
    },

    getCube(params) {
        let cube = cpinstance.get(params);
        let digit = this.getDigit(params.num);
        digit.setName("digit");
        cube.addChild(digit);
        return cube;
    },

    putCube(cube) {
        cube.stopAllActions();

        this.putDigit(cube.getChildByName("digit"));

        cpinstance.put(cube);
    },

    createDigit(str) {
        let node = new cc.Node();
        let label = node.addComponent(cc.Label);
        label.string = str || "";
        return node;
    },

    getDigit(num) {
        let node;
        if (this.pool_digit.size() > 0) {
            node = this.pool_digit.get();
        }
        else {
            node = this.createDigit();
        }
        node.scale = 1.0;
        node.getComponent(cc.Label).string = (num < 2 ? "" : num).toString();
        return node;
    },

    setCubeColor(cube, color) {
        cube.color = color;
    },
    setCubeDigit(cube, num) {
        let str = (num < 2 ? "" : num).toString();
        cube.getChildByName("digit").getComponent(cc.Label).string = str;
    },

    putDigit(node) {
        this.pool_digit.put(node);
    }
});

/*
缓存的初始化
*/

let ConfigModel = require("./ConfigModel");

let StarGameModel = require("./game/StarGameModel");
let UnionGameModel = require("./game/UnionGameModel");
let RussiaGameModel = require("./game/RussiaGameModel");

let ItemModel = require("./ItemModel");

cc.Class({

    ctor() {
        this.cfg = new ConfigModel();

        this.game = {
            star: new StarGameModel(),
            union: new UnionGameModel(),
            russia: new RussiaGameModel(),
        };

        this.item = new ItemModel();
    },

});

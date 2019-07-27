
let Utils = require("./Utils");
let Functions = require("./Functions");

cc.Class({

    statics: {
        init(ya) {

            ya.utils = new Utils();

            ya.func = new Functions();

        }
    }

});
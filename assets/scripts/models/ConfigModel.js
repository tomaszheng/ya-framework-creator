
/*
游戏配置
*/

let Model = require("../components/mvc/Model");

cc.Class({
    extends: Model,

    properties: {
        inreview: false,
    },

    ctor() {
        this.init();
    },

    init() {
        let review_time = 1546266593773;
        let cur_time = new Date().getTime();

        if (cur_time < review_time) {
            this.inreview = true;
        }
        else {
            this.inreview = false;
        }
    }
});
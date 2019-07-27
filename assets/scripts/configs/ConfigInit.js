
/*
配置的初始化
*/

cc.Class({

    statics: {
        init(ya) {
            ya.cfg = require("./GameConfig");

            ya.const = require("./GameConstant");

            ya.ekey = require("./EventKey");
            ya.rkey = require("./ReportKey");
            ya.skey = require("./StorageKey");

            ya.txt = require("./GameText");

            ya.res = require("./res/GameRes");
            ya.tex = require("./res/GameTexture");
            ya.res64 = require("./res/GameResBase64");
            ya.resclassify = require("./res/GameResClassify");
        }
    }

});
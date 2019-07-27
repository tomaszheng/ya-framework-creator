
let EventDispatcher = require("./event/EventDispatcher");

let MusicPlayer = require("./music/MusicPlayer");

let LocalStorage = require("./storage/LocalStorage");

cc.Class({

    statics: {
        init(ya) {
            ya.event = new EventDispatcher();

            ya.storage = new LocalStorage();

            ya.music = new MusicPlayer();
        }
    }

});

let CP = require("../components/CubePool");
let cpinstance = CP.getInstance();

let SC = require("../../../configs/game/StarConfig");

let _instance;

let StarPool = cc.Class({

    statics: {
        getInstance() {
            if (!_instance) {
                _instance = new StarPool();
            }
            return _instance;
        }
    },
    
    ctor() {
        this.pool_score = new cc.NodePool();
    },

    getUrl(color) {
        let url;
        switch(color) {
            case SC.RED:
                url = ya.tex.game_star_red; break;
            case SC.ORANGE:
                url = ya.tex.game_star_orange; break;
            case SC.YELLOW:
                url = ya.tex.game_star_yellow; break;
            case SC.GREEN:
                url = ya.tex.game_star_green; break;
            case SC.BLUE:
                url = ya.tex.game_star_blue; break;
        }
        return url;
    },

    getCube(params) {
        params = params || {};
        params.url = this.getUrl(params.color);
        params.color = cc.color(255, 255, 255);

        return cpinstance.get(params);
    },
    fill(cube, params) {
        params.url = this.getUrl(params.color);
        params.color = cc.color(255, 255, 255);
        cube.getComponent("Cube").fill(params);
    },
    setSpriteFrame(cube, color) {
        cube.getComponent("Cube").setSpriteFrame(this.getUrl(color));
    },

    putCube(cube) {
        cube.stopAllActions();
        cpinstance.put(cube);
    },

    createScore() {
        let score = new cc.Node();
        let label = score.addComponent(cc.Label);
        return score;
    },

    getScore(num) {
        let score;
        if (this.pool_score.size() > 0) {
            score = this.pool_score.get();
        }
        else {
            score = this.createScore();
        }
        score.scale = 1.0;
        score.getComponent(cc.Label).string = num.toString();
        return score;
    },

    putScore(score) {
        this.pool_score.put(score);
    }
});
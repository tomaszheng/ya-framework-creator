
/*
启动器
主场景被加载后，用来对游戏的初始化
*/

let ya = window.ya = {};

let ComponentInit = require("./components/ComponentInit");
let ConfigInit = require("./configs/ConfigInit");
let ModelInit = require("./models/ModelInit");
let UtilsInit = require("./utils/UtilsInit");

let DialogManager = require("./managers/DialogManager");
let ModuleManager = require("./managers/ModuleManager");
let ResouceManager = require("./managers/ResourceManager");

let BasicPlatform = require("./platforms/BasicPlatform");
let WeChatPlatform = require("./platforms/WeChatPlatform");

cc.Class({
    extends: cc.Component,

    properties: {
        layerView: cc.Node,
        layerDialog: cc.Node,
        layerTop: cc.Node,
    },

    onLoad() {

        this.initLayer();

        ConfigInit.init(ya);

        ComponentInit.init(ya);

        UtilsInit.init(ya);

        ya.model = new ModelInit();

        this.initPlatform();

        this.initManager();

        this.launch();
    },

    initLayer() {
        ya.layer = {};

        ya.layer.view   = this.layerView;   //场景层
        ya.layer.dialog = this.layerDialog; //弹窗层
        ya.layer.top    = this.layerTop;    //最顶层
    },

    initPlatform() {
        ya.platform = CC_WECHATGAME ? new WeChatPlatform() : new BasicPlatform();
    },

    initManager() {
        ya.dm = new DialogManager();
        ya.mm = new ModuleManager();
        ya.rm = new ResouceManager();
    },

    launch() {
        //global/toast常驻内存
        ya.mm.get("global").show();
        ya.mm.get("toast").show();

        ya.mm.show("loading");
    }
});
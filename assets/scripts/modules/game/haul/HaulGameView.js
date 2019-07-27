
let View = require("../../../components/mvc/View");

let Item = require("../../../widgets/Item");

cc.Class({
    extends: View,

    properties: {
        nd_metion: cc.Node,
    },

    initData(params) {

    },

    initUI() {
        let item = new Item();
        item.init({ mode: ya.const.ITEM_MODE.MIX, power: true, num: 199});
        item.position = cc.v2(200, 200);
        this.node.addChild(item);
    },

    initEvent() {

    },

    initClick() {

        ya.utils.addTouchEvent(this.node,
            (event)=>{

            },
            (event)=>{

            },
            (event)=>{
                
            });
    },

    onClick(event, name) {
        if (window['wx']) {
            let context = wx.getOpenDataContext();
            if (name === "init") {
                context.postMessage({ action: ya.const.WX.AC_INIT });
            }
            else if (name === "test") {
                context.postMessage({ action: ya.const.WX.AC_TEST });
            }
        }
    },

    onClickBlue() {
    },
});
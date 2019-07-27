
let Controller = require("../../components/mvc/Controller");

cc.Class({
    extends: Controller,

    properties: {
        id_item: -1,
        id_basket: -1,
    },

    initGlobalEvent() {
        ya.event.on(ya.ekey.EVT_SHOW_ITEM, this.onShowItem, this);
        ya.event.on(ya.ekey.EVT_SHOW_BASKET, this.onShowBasket, this);
    },

    onShowItem(params) {
        this.id_item = ya.dm.push({
            prefab: ya.res.prefab_item,
            script: "ItemView",
            init_data: params,
            loadded_data: true, show_type: 1
        });
        ya.dm.pop();
    },

    onShowBasket(params) {
        this.id_item = ya.dm.push({
            prefab: ya.res.prefab_basket,
            script: "BasketView",
            init_data: params,
            loadded_data: true, show_type: 1
        });
        ya.dm.pop();
    },
});
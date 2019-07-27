
/*
视图的基础类
*/

cc.Class({
    extends: cc.Component,

    //负责：视图实例的全局变量初始化
    ctor() {

    },

    //每个视图创建时必须要调用的初始化方法
    init(params) {
        this.initData(params);

        this.initUI();

        this.initEvent();

        this.initClick();
    },

    //初始化方法：解析外部传进来的初始化数据
    initData(params) {
        this.init_data = params;
        // body
    },

    //初始化UI，获取视图需要的UI句柄
    initUI() {

    },

    //初始化对model数据变化的事件监听
    initEvent() {

    },

    //初始化点击事件的监听
    initClick() {

    },

    //override
    //视图被销毁
    onDestroy() {
    },

    //IPhoneX 适配
    adjustIPhoneX(node_name) {
        let offset = ya.platform.getIPhoneXOffsetHeight();
        let node = this.node.getChildByName(node_name);
        if (!node) return;

        let widget = node.getComponent(cc.Widget);
        if (!widget) return;

        widget.top = offset;
        widget.updateAlignment();
    },

});

/*
弹窗的基础类
*/

cc.Class({
    extends: cc.Component,

    properties: {
        TOP: false, //此视图是否需要保持在最上面
        UNIQUE: true, //此视图是否同时只能显示一个
        ALWAYS_SHOW: false, //是否一直显示此视图

        _all_data: { default: {}, visible: false }, //打开视图时的全部参数

        init_data: { default: {}, visible: false }, //初始化的数据
        _is_inited: false, //是否已经初始化了

        _show_type: 0, //显示类型： 0直接打开，1缩放打开，2从指定位置打开

        load_data: { default: {}, visible: false }, //拿到的服务器数据
        _is_data_loadded: false, //数据是否已经拿到

        _enter_action: null, //进入动作
        _is_enter_finish: false, //进入完成
        _is_exit_finish: false, //退出完成

        _normal_position: { default: cc.v2(), visible: false }, //视图正常的位置

        vid: {
            get: function () {
                return this._all_data.vid;
            },
            visible: false
        }
    },

    //脚本被加载
    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, () => { }, this, true);
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.onClickSpace();
        }, this);
    },

    swallowTouch(node) {
        node.on(cc.Node.EventType.TOUCH_START, () => { }, this, true);
    },

    //初始化
    init(params) {
        params = params || {};

        this._all_data = params;

        this.initViewFeature();

        this.initData(params);
        this.initUI();
        this.initEvent();
        this.initClick();

        this._is_inited = true;
    },

    //初始化此视图的特性
    initViewFeature() {
        this.TOP = this._all_data.TOP !== undefined ? this._all_data.TOP : this.TOP;
        this.UNIQUE = this._all_data.UNIQUE !== undefined ? this._is_data_loadded.UNIQUE : this.UNIQUE;
        this.ALWAYS_SHOW = this._all_data.ALWAYS_SHOW !== undefined ? this._all_data.ALWAYS_SHOW : this.ALWAYS_SHOW;
    },

    //初始化数据
    initData(params) {
        this.init_data = params.init_data;

        this._is_data_loadded = params.loadded_data === true ? true : false;
        this._show_type = params.show_type ? params.show_type : 0;
    },

    //初始化UI，对UI进行初始化操作
    initUI() {

    },

    initEvent() {

    },

    initClick() {

    },

    //点击事件
    onClick(touch, name) {
        switch (name) {
        }
    },

    //触摸到了空白区域，默认关闭视图
    onClickSpace() {
        if (this._is_enter_finish) {
            ya.music.playEffect(ya.res.sound_click);
            this.removeSelf();
        }
    },


    //进入完成时，强制恢复到正常状态
    setNormalStatus() {
        this.opacity = 0;
        this.scale = 1.0;
    },

    setView() {
        if (!this._is_data_loadded) {
            return false;
        }
        return true;
    },
    //请求此视图的数据
    reqData() {
    },

    //服务器数据已拿到
    setData(data) {
        this.load_data = data;

        this._is_data_loadded = true;

        if (this._is_enter_finish) {
            this.setView(data);
        }
    },

    show() {
        //直接打开
        if (this._show_type === 0) {
            this.node.active = true;
            this.onEnterFinish();
        }
        //缩放打开
        else if (this._show_type === 1) {
            this.runEnterAction(() => {
                this.onEnterFinish();
            });
        }
        //从指定位置打开
        else if (this._show_type === 2) {
            this.runSpecialEnterAction(() => {
                this.onEnterFinish();
            });
        }
        else {
            this.runCustomEnterAction(() => {
                this.onEnterFinish();
            });
        }
    },
    onEnterFinish() {
        this._is_enter_finish = true;

        this.setNormalStatus();

        if (this._is_data_loadded) {
            this.setView(this.load_data);
        }
    },

    removeSelf() {
        ya.dm.remove(this._all_data.vid);
    },

    close() {
        //缩放打开时也缩放关闭
        if (this._show_type === 1) {
            this.runExitAction(() => {
                this.onExitFinish();
            });
        }
        else {
            this.onExitFinish();
        }
    },

    //直接展示视图
    display() {
        this.setNormalStatus();

        this.node.active = true;
        this.node.position = this._normal_position;
    },

    //直接隐藏
    hide() {
        this.setNormalStatus();

        if (this._enter_action) {
            this.node.stopAction(this._enter_action);
            this._enter_action = null;

            this.onEnterFinish();
        }

        this.node.active = false;
    },

    //退出动作完成回调
    onExitFinish() {
        let vid = this._all_data.vid;

        this._is_exit_finish = true;

        this.node.active = false;

        ya.dm.remove(vid);
    },

    //执行进入动作
    runEnterAction(callback) {
        this._normal_position = this.node.position;

        this.node.scale = 0.6;
        this.node.anchorX = this.node.anchorY = 0.5;

        let action = this.node.runAction(cc.sequence(
            cc.scaleTo(0.2, 1.08).easing(cc.easeSineOut()),
            cc.scaleTo(0.2, 1.0).easing(cc.easeSineOut()),
            cc.delayTime(0),
            cc.callFunc((sender) => {
                this._enter_action = null;
                if (callback) callback(sender);
            })
        ));
        this._enter_action = action;
    },
    //执行从指定位置打开的进入动作
    runSpecialEnterAction(callback) {
        let from_position = this._all_data.from_position || cc.v2(0, 0);

        this._normal_position = cc.v2(cc.winSize.width * 0.5, cc.winSize.height * 0.5);

        this.node.scale = 0;
        this.node.anchor = cc.v2(0.5, 0.5);
        this.node.position = from_position;

        let action = self.runAction(cc.sequence(
            cc.show(),
            cc.easeSineOut(cc.spawn(
                cc.moveTo(0.2, this._normal_position),
                cc.scaleTo(0.2, 1.0),
                cc.fadeIn(0.2)
            )),
            cc.easeSineOut(cc.scaleTo(0.1, 1.05)),
            cc.easeSineOut(cc.scaleTo(0.05, 1.0)),
            cc.delayTime(0),
            cc.callFunc((sender) => {
                this._enter_action = null;
                if (callback) callback(sender);
            })
        ));
        this._enter_action = action;
    },
    //override
    //执行视图定制的进入动作
    runCustomEnterAction() {

    },

    //开始执行退出动作
    runExitAction(callback) {
        this.node.runAction(cc.sequence(
            cc.spawn(
                cc.scaleTo(0.1, 0.8),
                cc.fadeTo(0.1, 130)
            ),
            cc.callFunc((sender) => {
                if (callback) callback(sender);
            })
        ));
    },
    
    //override
    //视图被销毁
    onDestroy() {
    }
});
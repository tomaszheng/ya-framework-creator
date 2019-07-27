/*
视图管理器
统一处理视图、弹窗的生命周期：显示、关闭
*/

cc.Class({
    properties: {
        root: null,
        zIndex: 0,

        queue: [],
        queue_num: 0,
        stack: [],
        stack_num: 0,

        background: null,
    },

    ctor() {
        this.root = ya.layer.dialog;
        this.root.setContentSize(cc.winSize);
        this.root.anchor = cc.v2();
        this.zIndex = this.root.zIndex;
    },

    clean() {
        this.queue = [];
        this.queue_num = 0;

        this.stack = [];
        this.stack_num = 0;

        this.root.destroyAllChildren();

    },

    getDialog(vid) {
        for (let i = 0; i < this.stack_num; i++) {
            if (this.stack[i].vid === vid) {
                return this.stack[i];
            }
        }
    },

    checkBackgroud() {
        if (!this.background) {
            let node = new cc.Node();
            let sprite = node.addComponent(cc.Sprite);
            sprite.type = cc.Sprite.Type.SLICED;
            sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
            sprite.spriteFrame = ya.rm.getSpriteFrame(ya.tex.game_cube_square);
            node.color = cc.color(0, 0, 0);
            node.active = false;
            node.opacity = 0;
            node.anchorX = node.anchorY = 0;
            node.setContentSize(cc.winSize);
            this.root.addChild(node);
            this.background = node;
        }

        if (this.stack_num <= 0) {
            this.background.active = false;
        }
        else {
            let active = this.background.active;
            this.background.active = true;
            if (!active) {
                this.background.stopAllActions();
                this.background.opacity = 0;
                this.background.runAction(cc.fadeTo(0.2, 178));
            }
            this.background.zIndex = this.stack[this.stack_num - 1].node.zIndex - 1;
        }
    },

    gen(params) {
        let prefab = params.prefab;
        let script = params.script;
        let show_type = params.show_type === undefined ? 1 : params.show_type;
        let init_data = params.init_data || {};
        let priority = params.priority || false;
        let loadded_data = params.loadded_data || false;

        let TOP = params.TOP;
        let UNIQUE = params.UNIQUE;
        let ALWAYS_SHOW = params.ALWAYS_SHOW;

        return {
            vid: ya.utils.uuid,
            prefab: prefab,
            script: script,
            priority: priority,
            show_type: show_type,
            loadded_data: loadded_data,

            init_data: init_data,

            TOP: TOP,
            UNIQUE: UNIQUE,
            ALWAYS_SHOW: ALWAYS_SHOW
        };
    },

    push(params, index) {
        if (!params || typeof params !== "object") return;

        if (!params.prefab || !params.script) return;

        let data = this.gen(params);

        if (index === undefined || index >= this.queue_num || index < 0) {
            this.queue.push(data);
        }
        else {
            this.queue.splice(index, 0, data);
        }
        this.queue_num++;

        return data.vid;
    },

	/*
	pop 取出队列顶端的弹窗数据，并打开相应的弹窗
	    stay 是否延迟执行 如果当前已经有界面在显示了，则stay=true时不再打开新界面
	    逻辑控制
	        先检查stay，如果为true，直接返回
	        再检查可见的界面是否设置了TOP，如果置为TOP=true，直接返回
	*/
    pop(stay) {
        stay = stay ? stay : false;

        if (this.queue_num <= 0) return;

        if (this.stack_num > 0) {
            let dialog = this.stack[this.stack_num - 1];

            if (stay && dialog.node.active) return;

            if (dialog.node.active && dialog.TOP) {
                if (!this.queue[0].TOP) {
                    return;
                }
            }
        }

        let data = this.queue.shift();
        this.queue_num--;

        this._hide();
        this._unique(data);
        this._show(data);
    },

	/*
	_hide 私有方法，外部不能调用
	    新界面被打开，隐藏当前已经显示的界面
	    逻辑控制
	        如果当前界面设置了ALWAYS_SHOW=true 不隐藏当前界面
	*/
    _hide() {
        if (this.stack_num <= 0) return;

        let w = this.stack[this.stack_num - 1];
        if (!w.ALWAYS_SHOW) {
            w.hide();
        }
    },
	/*
	_unique 私有方法，外部不能调用
	    t 要打开界面的数据
	    检查是否存在已经打开的界面与t界面相同，如果相同则移除已经打开的界面
	    逻辑控制
	        如果设置UNIQUE=false，可以存在多个相同的界面
	    在queue队列中未打开的不考虑
	*/
    _unique: function (t) {
        if (this.stack_num <= 0) return;

        for (let i = 0; i < this.stack_num; i++) {
            if (t.script.name === this.stack[i].name
                && this.stack[i].UNIQUE) {
                this.stack[i].node.destroy();

                this.stack.splice(i, 1);
                this.stack_num--;
                break;
            }
        }
    },
    /*
    _show 打开一个界面
	    t 要代码界面的数据
	    创建对象之后要执行reqData请求此界面的数据
        防止在init时请求数据时是使用的本地缓存，直接setData，导致时序错乱
    */
    _show: function (t) {
        //打开一个界面之前先检查弹窗层状态
        // this.reset();

        let prefab = t.prefab;
        if (typeof prefab === "string") {
            prefab = cc.loader.getRes(prefab);
        }
        let handler = cc.instantiate(prefab);
        let script = handler.getComponent(t.script);

        this.stack.push(script);
        this.stack_num++;

        script.init(t);
        script.reqData();
        script.show();

        this.root.addChild(handler, ++this.zIndex);

        this.checkBackgroud();
    },
    /*
   _remove 移除界面
	    vid 一个界面的id或者一组界面的id
	    只移除并删除stack中的记录
    */
    _remove: function (vid) {
        if (this.stack_num <= 0) return;

        for (let i = 0; i < this.stack_num; i++) {
            if (this.stack[i].vid === vid) {
                this.stack[i].node.destroy();

                this.stack.splice(i, 1);
                this.stack_num--;
                break;
            }
        }
    },
    /*
    remove 关闭一个界面或者一组界面
        uid 一个界面的id或者一组界面的id
        一般用在界面的关闭方法中
    */
    remove: function (vid) {
        if (vid instanceof Array) {
            for (let i = 0; i < vid.length; i++) {
                this._remove(vid[i]);
            }
        }
        else {
            this._remove(vid);
        }

        this.check();

        this.checkBackgroud();
    },
    /*
	_prepare 延迟一帧执行pop
	    只在check中调用
	    延迟一帧进行弹窗创建，防止弹窗之间切换导致卡顿
    */
    _prepare: function () {
        this.pop();
    },
    /*
	check 检查是否还有下一个界面要展示
	    逻辑控制
	        先检查有没有优先显示的界面
	        再显示隐藏的界面
	        最后pop
	*/
    check: function () {
        if (this.stack_num > 0 && this.stack[this.stack_num - 1].TOP) {
            let w = this.stack[this.stack_num - 1];
            w.display();
        }
        else if (this.queue_num > 0 && this.queue[0].priority) {
            this._prepare();
        }
        else if (this.stack_num > 0) {
            let w = this.stack[this.stack_num - 1];
            w.display();
        }
        else if (this.queue_num < 1) {
            //没有弹窗
        }
        else {
            this._prepare();
        }
    },
});
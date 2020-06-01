/*
视图管理器
统一处理视图、弹窗的生命周期：显示、关闭
*/

import YALayerManager from "./ya-layer-manager";
import YADialogProperty from "../mvc/ya-dialog-property";
import YAFunctions from "../utils/ya-functions";

export default class YADialogManager {

    /**
     * 所有弹窗的根节点
     */
    get root () {
        return YALayerManager.getInstance().dialog;
    }

    _zIndex: number = 0;
    set zIndex (zIndex: number) {
        this._zIndex = zIndex;
    }
    get zIndex () {
        return this._zIndex++;
    }

    queue = [];
    stack = [];

    _background: cc.Node = null;
    /**
     * 所有弹窗公用的背景
     */
    set background (background: cc.Node) {
        this._background = background;
        this.root.addChild(background);
    }
    get background () {
        return this._background;
    }

    private static _instance: YADialogManager = null;
    static getInstance (): YADialogManager {
        if (!this._instance) {
            this._instance = new YADialogManager();
        }
        return this._instance;
    }

    private constructor () {
        this.root.setContentSize(cc.winSize);
        this.root.setAnchorPoint(cc.v2());
        this.zIndex = this.root.zIndex;
    }
    
    getDialog (did: number) {
        for (let i = 0; i < this.stack.length; i++) {
            if (this.stack[i].did === did) {
                return this.stack[i];
            }
        }
    }

    checkBackgroud () {
        if (!this.background) {
            let node = new cc.Node();
            let sprite = node.addComponent(cc.Sprite);
            sprite.type = cc.Sprite.Type.SLICED;
            sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
            node.color = cc.color(0, 0, 0);
            node.active = false;
            node.opacity = 0;
            node.anchorX = node.anchorY = 0;
            node.setContentSize(cc.winSize);
            this.background = node;
        }

        if (this.stack.length <= 0) {
            this.background.active = false;
        }
        else {
            let active = this.background.active;
            this.background.active = true;
            if (!active) {
                cc.Tween.stopAllByTarget(this.background);
                this.background.opacity = 0;
                cc.tween(this.background).to(0.2, {fade: 178});
            }
            this.background.zIndex = this.stack[this.stack.length - 1].node.zIndex - 1;
        }
    }

    push (property: YADialogProperty): number;
    push (property: YADialogProperty, data: any): number;
    push (property: YADialogProperty, data: any, index: any): number;
    push (property: YADialogProperty, ...args: any[]): number {
        if (!property.prefab || !property.script) {
            return property.did;
        }

        let data: any = null, index: number = 0;
        if (args.length === 1) {
            data = args[0];
        }
        else if (args.length === 2) {
            data = args[0];
            data = args[1];
        }

        if (!YAFunctions.isValid(index) || index >= this.queue.length || index < 0) {
            this.queue.push({property: property, data: data});
        }
        else {
            this.queue.splice(index, 0, {property: property, data: data});
        }

        return property.did;
    }
    
    /**
     * 取出队列前端的弹窗数据，并打开相应的弹窗，与push配合适用
     */
    pop () {
        if (this.queue.length <= 0) return;

        if (this.stack.length > 0) {
            let dialog = this.stack[this.stack.length - 1];
            if (dialog.node.active && dialog.property.top) {
                if (!this.queue[0].property.top) {
                    return;
                }
            }
        }

        let info = this.queue.shift();
        this.show(info.property, info.data);
    }
    
	/*
	_hide 私有方法，外部不能调用
	    新界面被打开，隐藏当前已经显示的界面
	    逻辑控制
	        如果当前界面设置了ALWAYS_SHOW=true 不隐藏当前界面
    */
    /**
     * 当新界面被打开时，隐藏原先最顶部的弹窗
     */
    private hide () {
        if (this.stack.length > 0) {
            let dialog = this.stack[this.stack.length - 1]
            if (!dialog.params.always) {
                dialog.hide();
            }
        }
    }

    /**
     * 检查是否存在已经打开的界面与t界面相同，如果相同则移除已经打开的界面
     * @param t 
     */
    private unique (property: YADialogProperty) {
        if (this.stack.length <= 0) return;

        for (let i = 0; i < this.stack.length; i++) {
            if (property.script === this.stack[i].property.script && this.stack[i].property.unique) {
                this.stack[i].node.destroy();
                this.stack.splice(i, 1);
                break;
            }
        }
    }

   /**
    * 打开一个弹窗
    * @param property 弹窗属性
    * @param data 初始化弹窗的数据
    */
    show (property: YADialogProperty, data?: any) {
        //打开一个界面之前先检查弹窗层状态
        // this.reset();

        this.hide();
        this.unique(property);

        this._show(property, data);

        this.checkBackgroud();
    }

    private _show (property: YADialogProperty, data?: any) {
        let handler = cc.instantiate(cc.loader.getRes(property.prefab));
        let component = handler.getComponent(property.script);

        this.stack.push(component);

        component.init(property, data);
        component.show();

        this.root.addChild(handler, ++this.zIndex);
    }

    private _remove (did: number) {
       if (this.stack.length <= 0) return;
       
        for (let i = 0; i < this.stack.length; i++) {
            if (this.stack[i].property.did === did) {
                this.stack[i].node.destroy();
                this.stack.splice(i, 1);
                break;
            }
        }
    }

    /**
    * 关闭一个弹窗或者一组弹窗
    * @param did 
    */
    remove (did: number|number[]) {
        if (did instanceof Array) {
            for (let i = 0; i < did.length; i++) {
                this._remove(did[i]);
            }
        }
        else {
            this._remove(did);
        }

        this.check();

        this.checkBackgroud();
    }
    
    private prepare () {
        this.pop();
    }

    private check () {
        let length = this.stack.length;
        if (this.stack.length > 0) {
            let dialog = this.stack[length - 1];
            if (!dialog.node.active) {
                dialog.display();
            }
        }
        else if (this.queue.length > 0) {
            this.prepare();
        }
    }

    /**
     * 清理所有的弹窗
     */
    clean () {
        this.queue = [];

        for (let i = 0; i < this.stack.length; i++) {
            this.stack[i].node.destroy();
        }
        this.stack = [];
    }
}
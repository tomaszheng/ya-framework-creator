import YAUtils from "../utils/ya-utils";
import YAFunctions from "../utils/ya-functions";

export default class YADialogProperty {

    static seed: number = 0;
    static newDid (): number {
        return this.seed++;
    }

    static ShowTypes = {
        /**
         * 直接出现，没有动作
         */
        NO: 1,
    
        /**
         * 缩放打开
         */
        SCALE: 2,
    
        /**
         * 从指定位置缩放打开
         */
        POSITION_SCALE: 3,
    
        /**
         * 从指定位置移动
         */
        POSITION_MOVE: 4,
    
        /**
         * 以派发事件的形式代替打开弹窗
         */
        EVENT: 5,
    
        /**
         * 自定义
         */
        CUSTOM: 6,
    };

    _did: number = 0;
    /**
     * 标记此弹窗的唯一id
     */
    set did (did: number) {
        this._did = did;
    }
    get did () {
        return this._did;
    }
    
    _top: boolean = false;
    /**
     * 是否置顶弹窗
     */
    set top (v: boolean) {
        this._top = v;
    }
    get top () {
        return this._top;
    }

    _unique: boolean = true;
    /**
     * 是否保持弹窗唯一性：同一个弹窗同时只能同时存在一个
     */
    set unique (v: boolean) {
        this._unique = v;
    }
    get unique () {
        return this._unique;
    }

    _always: boolean = false;
    /**
     * 弹窗无论何时都要显示
     */
    set always (v: boolean) {
        this._always = v;
    }
    get always () {
        return this._always;
    }

    _showType: number = YADialogProperty.ShowTypes.NO;
    /**
     * 以什么样的方式打开弹窗
     */
    set showType (v: number) {
        this._showType = v;
    }
    get showType () {
        return this._showType;
    }

    _showEvent: string = "";
    /**
     * 当打开方式为EVENT时有效，事件名
     */
    set showEvent (v: string) {
        this._showEvent = v;
    }
    get showEvent () {
        return this._showEvent;
    }

    _dataLoadded: boolean = false;
    /**
     * 弹窗数据是否已经加载完成
     */
    set dataLoadded (v: boolean) {
        this._dataLoadded = v;
    }
    get dataLoadded () {
        return this._dataLoadded;
    }

    _script: string = null;
    /**
     * 脚本名称
     */
    set script (script: string) {
        this._script = script;
    }
    get script (): string {
        return this._script;
    }

    _prefab: string = null;
    /**
     * 弹窗对应的预制体路径
     */
    set prefab (prefab: string) {
        this.prefab = prefab;
    }
    get prefab () {
        return this._prefab;
    }

    constructor(preopery: any) {
        this.did = YADialogProperty.newDid();

        YAFunctions.isValid(preopery.top) && (this.top = preopery.top)
        YAFunctions.isValid(preopery.unique) && (this.unique = preopery.unique);
        YAFunctions.isValid(preopery.always) && (this.always = preopery.always);
        YAFunctions.isValid(preopery.showType) && (this.showType = preopery.showType);
        YAFunctions.isValid(preopery.showEvent) && (this.showEvent = preopery.showEvent);
        YAFunctions.isValid(preopery.dataLoadded) && (this.dataLoadded = preopery.dataLoadded);

        this.script = preopery.script;
        this.prefab = preopery.prefab;
    }
}
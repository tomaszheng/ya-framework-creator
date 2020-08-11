import {YaFunctions} from "../utils/ya-functions";

const YaDialogCharacter = {
    NONE: 0,

    /**
     * 常驻，一直显示
     */
    RESIDENT: 1,

    /**
     * 唯一性，此类型的弹窗同时只能存在一个
     */
    UNIQUE: 2,

    /**
     * 置顶
     */
    TOP: 3,
};

class YaDialogProperty {
    /**
     * 标记此弹窗的唯一id
     */
    set id(did: number) {
        this._id = did;
    }

    get id() {
        return this._id;
    }

    /**
     * 是否置顶弹窗
     */
    set top(v: boolean) {
        this._top = v;
    }

    get top() {
        return this._top;
    }

    /**
     * 是否保持弹窗唯一性：同一个弹窗同时只能同时存在一个
     */
    set unique(v: boolean) {
        this._unique = v;
    }

    get unique() {
        return this._unique;
    }

    /**
     * 弹窗无论何时都要显示
     */
    set always(v: boolean) {
        this._always = v;
    }

    get always() {
        return this._always;
    }

    /**
     * 以什么样的方式打开弹窗
     */
    set showType(v: number) {
        this._showType = v;
    }

    get showType() {
        return this._showType;
    }

    /**
     * 当打开方式为EVENT时有效，事件名
     */
    set showEvent(v: string) {
        this._showEvent = v;
    }

    get showEvent() {
        return this._showEvent;
    }

    /**
     * 弹窗数据是否已经加载完成
     */
    set dataLoaded(v: boolean) {
        this._dataLoaded = v;
    }

    get dataLoaded() {
        return this._dataLoaded;
    }

    /**
     * 脚本名称
     */
    set script(script: string) {
        this._script = script;
    }

    get script(): string {
        return this._script;
    }

    /**
     * 弹窗对应的预制体路径
     */
    set prefab(prefab: string) {
        this._prefab = prefab;
    }

    get prefab() {
        return this._prefab;
    }

    constructor(property: any) {
        this.id = YaDialogProperty.newDid();

        if (YaFunctions.isValid(property.top)) this.top = property.top;
        if (YaFunctions.isValid(property.unique)) this.unique = property.unique;
        if (YaFunctions.isValid(property.always)) this.always = property.always;
        if (YaFunctions.isValid(property.showType)) this.showType = property.showType;
        if (YaFunctions.isValid(property.showEvent)) this.showEvent = property.showEvent;
        if (YaFunctions.isValid(property.dataLoadded)) this.dataLoaded = property.dataLoadded;

        this.script = property.script;
        this.prefab = property.prefab;
    }

    static seed = 0;

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

    private _id = 0;

    private _resident = false;

    private _unique = true;

    _top = false;

    _always = false;

    _showType: number = YaDialogProperty.ShowTypes.NO;

    _showEvent = "";

    _dataLoaded = false;

    _script: string = null;

    _prefab: string = null;

    static newDid(): number {
        return this.seed++;
    }
}

export {YaDialogProperty};
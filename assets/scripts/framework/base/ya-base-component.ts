const {ccclass} = cc._decorator;

@ccclass
class YaBaseComponent extends cc.Component {
    protected get data() {
        return this._data;
    }

    /**
     * override
     * 此组件对应的prefab路径，子类必须重载
     */
    protected get prefabPath(): string {
        return '';
    }

    public get instantiatedPrefabPath() {
        return this._instantiatedPrefabPath;
    }
    public set instantiatedPrefabPath(path) {
        this._instantiatedPrefabPath = path;
    }

    private _data: any = null;
    private _initialized = false;
    private _instantiatedPrefabPath = '';

    /**
     * 初始化组件
     * 1, 初始化数据
     * 2, 初始化UI
     * 3, 初始化Touch事件：点击、拖拽
     * 4, 初始化数据事件
     * @param data
     */
    public init(data?: any) {
        this.initData(data);
        this.initUI();
        this.initTouchEvent();
        this.initModelEvent();
        this._initialized = true;
    }

    protected initData(data?: any) {
        this._data = data;
    }

    protected initUI() {

    }

    protected initTouchEvent() {

    }

    protected initModelEvent() {

    }

    /**
     * 更新UI
     */
    public updateUI() {

    }

    protected update(dt: number) {
        super.update(dt);
    }

    protected lateUpdate(dt: number) {
        super.lateUpdate(dt);
    }

    protected onDestroy() {
        super.onDestroy();

        // TODO - clear event
    }
}

export {YaBaseComponent};
import {IRefRecord, resourceManager} from "../manager/ResourceManager";
import {uiUtils} from "../utils/UIUtils";

const {ccclass} = cc._decorator;

@ccclass
class BaseComponent extends cc.Component {
    private _refRecords: Map<string, IRefRecord[]>;

    protected get data() {
        return this._data;
    }

    public get instantiatedPrefabPath() {
        return this._instantiatedPrefabPath;
    }

    public set instantiatedPrefabPath(prefabPath) {
        this._instantiatedPrefabPath = prefabPath;
    }

    /**
     * override
     * 此组件对应的prefab路径，子类必须重载
     */
    protected get prefabPath(): string {
        return '';
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
        this._refRecords = new Map<string, IRefRecord[]>();
    }

    protected initUI() {

    }

    protected initTouchEvent() {

    }

    protected initModelEvent() {

    }

    protected async loadAsset(path: string, type: typeof cc.Asset, data?: any) {
        let promise;
        if (cc.js.isChildClassOf(type, cc.Prefab)) {
            promise = uiUtils.instantiatePath(path, data);
        } else {
            promise = resourceManager.load(path, type);
        }
        promise.then(()=>{
            if (cc.isValid(this)) {
                this.addRef(path, type);
            } else {
                resourceManager.recordRef(path, type);
            }
        });
        return promise;
    }

    public updateData(data?: any) {
        this._data = data;
    }

    public updateUI() {

    }

    /**
     * 操纵父类或节点必须激活的逻辑放在这里
     */
    protected start() {

    }

    protected update(dt: number) {

    }

    protected lateUpdate(dt: number) {

    }

    public addRef(path: string, type: typeof cc.Asset) {
        if (this._refRecords.has(path)) {
            const records = this._refRecords.get(path);
            let found = false;
            records.some((record) => {
               if (path === record.path && type === record.type) {
                   found = true;
                   record.refCount++;
                   return true;
               }
            });
            if (!found) {
                records.push({path, type, refCount: 1});
                resourceManager.addRef(path, type);
            }
        } else {
            this._refRecords.set(path, [{path, type, refCount: 1}]);
            resourceManager.addRef(path, type);
        }
    }

    public decRef(path: string, type: typeof cc.Asset) {
        if (this._refRecords.has(path)) {
            const records = this._refRecords.get(path);
            records.some((record) => {
                if (path === record.path && type === record.type && record.refCount > 0) {
                    record.refCount--;
                    if (record.refCount === 0) resourceManager.decRef(path, type);
                    return true;
                }
            });
        }
    }

    public decAllRef() {
        this._refRecords.forEach((records, path) => {
            records.every((record) => {
                if (record.refCount > 0) {
                    resourceManager.decRef(record.path, record.type);
                }
            });
        });
        this._refRecords = new Map<string, IRefRecord[]>();
    }

    protected onDestroy() {
        this.decAllRef();
    }
}

export {BaseComponent};

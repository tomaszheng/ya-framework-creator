import {resourceManager} from "../manager/ResourceManager";
import {uiUtils} from "../utils/UIUtils";
import {BaseRefRecord} from "../ref-record/BaseRefRecord";
import {refManager} from "../ref-record/RefManager";

const {ccclass} = cc._decorator;

@ccclass
class BaseComponent extends cc.Component {
    protected get data() {
        return this._data;
    }

    public get instantiatedPrefabPath() {
        return this._instantiatedPrefabPath;
    }

    public set instantiatedPrefabPath(prefabPath: string) {
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
    private _refRecord: BaseRefRecord = null;

    public init(data?: any) {
        this.initData(data);
        this.initUI();
        this.initTouchEvent();
        this.initModelEvent();
        this._initialized = true;
    }

    protected initData(data?: any) {
        this._data = data;
        this._refRecord = refManager.getOrCreateRefRecord(cc.js.getClassName(this));
    }

    protected initUI() {

    }

    protected initTouchEvent() {

    }

    protected initModelEvent() {

    }

    protected async loadAsset(fullPath: string, type: typeof cc.Asset, data?: any) {
        this._refRecord.recordRef(fullPath, type);

        let promise;
        if (cc.js.isChildClassOf(type, cc.Prefab)) {
            promise = uiUtils.loadAndInstantiate(fullPath, data);
        } else {
            promise = resourceManager.load(fullPath, type);
        }
        promise.then(()=>{
            if (cc.isValid(this)) {
                this.addRef(fullPath, type);
            }
        });
        return promise;
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
        this._refRecord.addRef(path, type);
    }

    public decRef(path: string, type: typeof cc.Asset) {
        this._refRecord.decRef(path, type);
    }

    public decAllRef() {
        this._refRecord.decAllRef();
    }

    protected onDestroy() {
        this.decAllRef();
    }
}

export {BaseComponent};

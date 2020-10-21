import {CacheModel} from "../model/CacheModel";
import {UserModel} from "../model/UserModel";
import {ItemModel} from "../model/ItemModel";
import {Singleton} from "../framework/singleton/Singleton";

class ModelManager extends Singleton<ModelManager> {
    public get cache(): CacheModel {
        return this._cache;
    }

    public get user(): UserModel {
        return this._user;
    }

    public get item(): ItemModel {
        return this._item;
    }

    private _cache: CacheModel;
    private _user: UserModel;
    private _item: ItemModel;

    public init() {
        this._cache = new CacheModel();
        this._user = new UserModel();
        this._item = new ItemModel();
    }
}

const modelManager = ModelManager.instance(ModelManager);
export {modelManager};

import {CacheModel} from "../model/CacheModel";
import {UserModel} from "../model/UserModel";
import {ItemModel} from "../model/ItemModel";

class ModelManager {
    private static _instance: ModelManager = null;
    public static get instance(): ModelManager {
        if (!this._instance) {
            this._instance = new ModelManager();
        }
        return this._instance;
    }

    private _cache: CacheModel;
    public get cache(): CacheModel {
        return this._cache;
    }

    private _user: UserModel;
    public get user(): UserModel {
        return this._user;
    }

    private _item: ItemModel;
    public get item(): ItemModel {
        return this._item;
    }

    public init() {
        this._cache = new CacheModel();
        this._user = new UserModel();
        this._item = new ItemModel();
    }
}

export { ModelManager }
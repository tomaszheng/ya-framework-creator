/*
资源管理器
统一处理资源的加载，针对Native和Web平台，略有区别：
Native平台：
有需要时再加载
Web平台：
在打开某一功能模块之前，建议把所有依赖和用到的资源全部加载/下载
*/

import {Singleton} from "../singleton/Singleton";

interface IRefRecord {
    path: string;
    type: typeof cc.Asset;
    refCount: number;
}

class YaResourceManager extends Singleton<YaResourceManager> {
    private _refRecords: Map<string, Map<string, IRefRecord>>;

    public static loadBundle(nameOrUrl: string, onComplete: (bundle: cc.AssetManager.Bundle) => void) {
        if (cc.assetManager.getBundle(nameOrUrl)) {
            onComplete(cc.assetManager.getBundle(nameOrUrl));
        } else {
            cc.assetManager.loadBundle(nameOrUrl, null, (err, bundle) => {
                onComplete(bundle);
            });
        }
    }

    public static parsePath(path: string): { bundleName, resPath } {
        const index = path.indexOf('/');
        const bundleName = path.slice(0, index);
        const resPath = path.slice(index + 1, path.length);
        return {bundleName, resPath};
    }

    public init() {
        this._refRecords = new Map<string, Map<string, IRefRecord>>();
    }

    public async load(path: string, type: typeof cc.Asset) {
        return new Promise<cc.Asset>((resolve, reject) => {
            const {bundleName, resPath} = YaResourceManager.parsePath(path);
            YaResourceManager.loadBundle(bundleName, (bundle => {
                bundle.load(resPath, type, (err: Error, asset: cc.Asset) => {
                    if (!err) {
                        resolve(asset);
                    } else {
                        reject(err);
                    }
                });
            }));
        });
    }

    public loadSpriteFrame(path: string, node: cc.Node | cc.Sprite) {
        this.load(path, cc.SpriteFrame).then((spriteFrame: cc.SpriteFrame) => {
            const sprite = node instanceof cc.Sprite ? node : node.getComponent(cc.Sprite);
            if (sprite) sprite.spriteFrame = spriteFrame;
        });
    }

    public getSpriteFrame(path: string): cc.SpriteFrame {
        const asset = this.getAsset(path, cc.SpriteFrame);
        return asset as cc.SpriteFrame;
    }

    /**
     * 使用此方法前，请确保这些资源已经通过 bundle:load方法加载过
     * @param path 资源全路径
     * @param type 资源类型
     */
    public getAsset(path: string, type: typeof cc.Asset): cc.Asset {
        const {bundleName, resPath} = YaResourceManager.parsePath(path);
        const bundle = cc.assetManager.getBundle(bundleName);
        return bundle && bundle.get(resPath, type);
    }

    public addRef(path: string, type: typeof cc.Asset) {
        const {bundleName, resPath} = YaResourceManager.parsePath(path);

        if (!this._refRecords.has(bundleName)) {
            this._refRecords.set(bundleName, new Map<string, IRefRecord>());
        }

        const record = this._refRecords.get(bundleName);
        if (record.has(resPath)) {
            const recordItem = record.get(resPath);
            recordItem.refCount++;
        } else {
            record.set(resPath, {
                path,
                type,
                refCount: 1,
            });
        }
    }

    public decRef(path: string, type: typeof cc.Asset) {
        const {bundleName, resPath} = YaResourceManager.parsePath(path);

        if (!this._refRecords.has(bundleName)) return;

        const record = this._refRecords.get(bundleName);
        if (record.has(resPath)) {
            const recordItem = record.get(resPath);
            if (recordItem.refCount > 0) recordItem.refCount--;
        }
    }

    public dump() {
        console.log('start dump ref record ...');
        this._refRecords.forEach((record, bundleName) => {
            record.forEach((recordItem) => {
                const {path, refCount} = recordItem;
                console.log(`bundleName=${bundleName} path=${path} refCount=${refCount}`);
            });
        });
        console.log('dump ref record finish.');
    }

    /**
     * 非公共包之间禁止相互引用，否则资源将无法释放
     * @param bundleName
     */
    public removeBundle(bundleName: string) {
        const bundle = cc.assetManager.getBundle(bundleName);
        if (!bundle || !this._refRecords.has(bundleName)) return;

        const deleteList: string[] = [];
        const record = this._refRecords.get(bundleName);
        record.forEach((recordItem, resPath) => {
            const {path, type, refCount} = recordItem;
            if (refCount === 0 && bundle.get(path, type).refCount === 0) {
                bundle.release(path);
                deleteList.push(resPath);
            }
        });

        deleteList.every((resPath) => {
           record.delete(resPath);
        });

        if (record.size === 0) this._refRecords.delete(bundleName);
    }

    /**
     * 释放所有未使用的资源，注意：会把公共包的资源一并释放
     */
    public removeUnusedAsset() {
        const bundleNames: string[] = [];
        this._refRecords.forEach((record, bundleName) => {
            bundleNames.push(bundleName);
        });

        bundleNames.every((bundleName) => {
           this.removeBundle(bundleName);
        });
    }
}

const yaResourceManager = YaResourceManager.instance(YaResourceManager);
export {yaResourceManager, IRefRecord};

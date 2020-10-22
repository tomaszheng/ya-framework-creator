/*
资源管理器
统一处理资源的加载，针对Native和Web平台，略有区别：
Native平台：
有需要时再加载
Web平台：
在打开某一功能模块之前，建议把所有依赖和用到的资源全部加载/下载
*/

import {Singleton} from "../singleton/Singleton";
import {BaseRefRecord} from "../ref-record/BaseRefRecord";
import {utils} from "../utils/Utils";
import {refManager} from "../ref-record/RefManager";

class ResourceManager extends Singleton<ResourceManager> {
    private _refRecord: BaseRefRecord = null;

    public static loadBundle(nameOrUrl: string, onComplete: (bundle: cc.AssetManager.Bundle) => void) {
        if (cc.assetManager.getBundle(nameOrUrl)) {
            onComplete(cc.assetManager.getBundle(nameOrUrl));
        } else {
            cc.assetManager.loadBundle(nameOrUrl, null, (err, bundle) => {
                onComplete(bundle);
            });
        }
    }

    public init() {
        this._refRecord = refManager.getOrCreateRefRecord(cc.js.getClassName(this));
    }

    public isLoaded(fullPath: string, type: typeof cc.Asset): boolean {
        const {bundleName, path} = utils.parseBundlePath(fullPath);
        const bundle = cc.assetManager.getBundle(bundleName);
        return bundle && !!bundle.get(path, type);
    }

    public async load(fullPath: string, type: typeof cc.Asset) {
        return new Promise<cc.Asset>((resolve, reject) => {
            const {bundleName, path} = utils.parseBundlePath(fullPath);
            ResourceManager.loadBundle(bundleName, (bundle => {
                bundle.load(path, type, (err: Error, asset: cc.Asset) => {
                    if (!err) {
                        resolve(asset);
                    } else {
                        cc.log(`load ${path} failed. error: ${err}`);
                        reject(err);
                    }
                });
            }));
        });
    }

    public async loadSpriteFrame(path: string, node: cc.Node | cc.Sprite) {
        return this.load(path, cc.SpriteFrame).then((spriteFrame: cc.SpriteFrame) => {
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
     * @param fullPath 资源全路径
     * @param type 资源类型
     */
    public getAsset(fullPath: string, type: typeof cc.Asset): cc.Asset {
        const {bundleName, path} = utils.parseBundlePath(fullPath);
        const bundle = cc.assetManager.getBundle(bundleName);
        return bundle && bundle.get(path, type);
    }

    public addRef(fullPath: string, type: typeof cc.Asset) {
        this._refRecord.addRef(fullPath, type);
    }

    public decRef(fullPath: string, type: typeof cc.Asset) {
        this._refRecord.addRef(fullPath, type);
    }

    public removeUnusedAssets() {
        const bundleNames = refManager.getAllBundleNames();
        bundleNames.every((bundleName: string) => {
           this.removeUnusedAssetsInBundle(bundleName);
        });
    }

    public removeUnusedAssetsInBundle(bundleName: string) {
        const bundle = cc.assetManager.getBundle(bundleName);
        bundle.releaseUnusedAssets();
    }

    public removeAsset(fullPath: string, type: typeof cc.Asset) {
        const {bundleName, path} = utils.parseBundlePath(fullPath);
        const bundle = cc.assetManager.getBundle(bundleName);
        const asset = bundle.get(path, type);
        if (asset && asset.refCount <= 0) {
            bundle.release(path, type);
        }
    }
}

const resourceManager = ResourceManager.instance(ResourceManager);
export {resourceManager};

/*
资源管理器
统一处理资源的加载，针对Native和Web平台，略有区别：
Native平台：
有需要时再加载
Web平台：
在打开某一功能模块之前，建议把所有依赖和用到的资源全部加载/下载
*/

import {YaUtils} from "../utils/ya-utils";
import {Singleton} from "../singleton/Singleton";

class YaResourceManager extends Singleton<YaResourceManager> {
    private spriteAtlases = {};
    private spriteFrames = {};
    private resourceLoaded = {};

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
}

const yaResourceManager = YaResourceManager.instance(YaResourceManager);
export {yaResourceManager};
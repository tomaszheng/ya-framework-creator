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

    splitPathAndType(res: any) {
        let path = "";
        let type: cc.Asset = null;
        if (typeof res === "string") {
            path = res;
        } else {
            path = res[0];
            type = res[1];
        }
        return {path, type};
    }

    splitPathsAndTypes(resList: any[]) {
        const paths = [];
        const types: typeof cc.Asset[] = [];

        for (let i = 0; i < resList.length; i++) {
            if (typeof resList[i] === "string") {
                paths[i] = resList[i];
            } else {
                paths[i] = resList[i][0];
                types[i] = resList[i][1];
            }
        }

        return {paths, types};
    }

    /**
     * 加载资源
     * @param modules 模块名称列表
     * @param progressCallback 加载进度回调
     * @param completedCallback 加载完成回调
     */
    load(resList: any[], completedCallback: () => void, progressCallback?: any) {
        if (this.isLoaded(resList)) {
            YaUtils.doCallback(completedCallback, null);
        } else {
            const pathAndTypes = this.splitPathsAndTypes(resList);
            cc.loader.loadResArray(pathAndTypes.paths, pathAndTypes.types, (completedCount: number, totalCount: number, item: any) => {
                this.loadProgress(completedCount, totalCount, item, progressCallback);
            }, (error: Error, resource: any[]) => {
                if (!!error) {
                    console.error(`error=${error}`);
                    this.load(resList, completedCallback, progressCallback);
                } else {
                    this.loadCompleted(resource, resList, completedCallback);
                }
            });
        }
    }

    private loadProgress(completedCount: number, totalCount: number, item: any, progressCallback: ()=>void) {
        if (!item) { // 下载出错

        } else {
            YaUtils.doCallback(progressCallback, {
                item,
                totalCount,
                completedCount,
            });
        }
    }

    private loadCompleted(resource: any[], resList: any[], completedCallback: ()=>void) {
        this.setLoaded(resList, true);

        this.cacheSpriteAtlas(resource);

        YaUtils.doCallback(completedCallback, null);
    }

    setLoaded(resList: any[], loaded: boolean) {
        for (const res of resList) {
            this.resourceLoaded[res] = loaded;
        }
    }

    /**
     * 判断给定的资源列表是否加载完成
     * @param resList 资源列表
     */
    isLoaded(resList: any[]) {
        for (const res of resList) {
            if (!this.resourceLoaded[res]) {
                return false;
            }
        }
        return true;
    }

    private cacheSpriteAtlas(resource: any[]) {
        if (!resource || resource.length <= 0) return;

        resource.forEach(item => {
            if (item instanceof cc.SpriteAtlas) {
                this.spriteAtlases[item.name] = item;

                const spriteFrames = item.getSpriteFrames();
                spriteFrames.forEach(spriteFrame => {
                    this.spriteFrames[spriteFrame.name] = spriteFrame;
                });
            }
        });
    }

    /**
     * 获取图集中的精灵帧
     * @param name 精灵帧名称
     */
    getSpriteFrame(name: string) {
        return this.spriteFrames[name];
    }
}

const yaResourceManager = YaResourceManager.instance(YaResourceManager);
export {yaResourceManager};
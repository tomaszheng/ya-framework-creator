/*
资源管理器
统一处理资源的加载
*/

import YAUtils from "../Utils/YAUtils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class YAResourceManager {
    
    private spriteAtalss = {};
    private spriteFrames = {};
    private resourceLoaddeds = {};

    static _instance: YAResourceManager = null;
    static getInstance(): YAResourceManager {
        if (this._instance) {
            this._instance = new YAResourceManager();
        }
        return this._instance;
    }

    private constructor () {

    }

    splitPathAndType (res: any) {
        let path: string = "", type: cc.Asset = null;
        if (typeof res === "string") {
            path = res
        }
        else {
            path = res[0];
            type = res[1];
        }
        return {path: path, type: type};
    }

    splitPathsAndTypes (resList: any[]) {
        let paths = [], types: typeof cc.Asset[] = [];

        for (let i = 0; i < resList.length; i++) {
            if (typeof resList[i] === "string") {
                paths[i] = resList[i];
            }
            else {
                paths[i] = resList[i][0];
                types[i] = resList[i][1];
            }
        }

        return {paths: paths, types: types};
    }

    /**
     * 加载资源
     * @param modules 模块名称列表
     * @param progressCallback 加载进度回调
     * @param completedCallback 加载完成回调
     */
    load (resList: any[], completedCallback: Function, progressCallback?: any) {
        if (this.isLoadded(resList)) {
            YAUtils.doCallback(completedCallback, null);
        }
        else {
            let pathAndTypes = this.splitPathsAndTypes(resList);
            cc.loader.loadResArray(pathAndTypes.paths, pathAndTypes.types, (completedCount: number, totalCount: number, item: any) => {
                this.loadProgress(completedCount, totalCount, item, progressCallback);
            }, (error: Error, resource: any[]) => {
                if (!!error) {
                    this.load(resList, completedCallback, progressCallback);
                }
                else {
                    this.loadCompleted(resource, resList, completedCallback);
                }
            });
        }
    }
    
    private loadProgress(completedCount: number, totalCount: number, item: any, progressCallback: Function) {
        if (!item) { // 下载出错

        }
        else {
            YAUtils.doCallback(progressCallback, {
                item: item,
                totalCount: totalCount,
                completedCount: completedCount,
            });
        }
    }

    private loadCompleted(resource: any[], resList: any[], completedCallback: Function) {
        this.setLoadded(resList, true);

        this.cacheSpriteAtlas(resource);

        YAUtils.doCallback(completedCallback, null);
    }
    
    setLoadded (resList: any[], loadded: boolean) {
        for (let i = 0; i < resList.length; i++) {
            this.resourceLoaddeds[resList[i]] = loadded;
        }
    }

    /**
     * 判断给定的资源列表是否加载完成
     * @param resList 资源列表
     */
    isLoadded (resList: any[]) {
        for (let i = 0; i < resList.length; i++) {
            if (!this.resourceLoaddeds[resList[i]]) {
                return false;
            }
        }

        return true;
    }

    private cacheSpriteAtlas (resource: any[]) {
        if (!resource || resource.length <= 0) return;
        
        resource.forEach(item => {
            if (item instanceof cc.SpriteAtlas) {
                this.spriteAtalss[item.name] = item;

                let spriteFrames = item.getSpriteFrames();
                spriteFrames.forEach(spriteFrame => {
                    this.spriteFrames[spriteFrame.name] = spriteFrame;
                })
            }
        });
    }

    /**
     * 获取图集中的精灵帧
     * @param name 精灵帧名称
     */
    getSpriteFrame (name: string) {
        return this.spriteFrames[name];
    }
}

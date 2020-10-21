
/*
游戏全局缓存
*/

import {BaseModel} from "../framework/mvc/BaseModel";

class CacheModel extends BaseModel {
    inReview = false;

    public init() {
        const reviewTime = 1546266593773;
        const curTime = new Date().getTime();

        this.inReview = curTime < reviewTime;
    }
}

export {CacheModel};

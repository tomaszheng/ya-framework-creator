
/*
游戏全局缓存
*/

import {ya} from "../framework/ya";

class CacheModel extends ya.Model {
    inReview = false;

    public init() {
        const reviewTime = 1546266593773;
        const curTime = new Date().getTime();

        if (curTime < reviewTime) {
            this.inReview = true;
        }
        else {
            this.inReview = false;
        }
    }
}

export {CacheModel};
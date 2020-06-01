
/*
游戏全局缓存
*/

import ya from "../framework/ya";

export default class CacheModel extends ya.Model {
    inReview: boolean = false;

    constructor () {
        super();

        let review_time = 1546266593773;
        let cur_time = new Date().getTime();

        if (cur_time < review_time) {
            this.inReview = true;
        }
        else {
            this.inReview = false;
        }
    }
}

import cfg from "./config";
import util from "./util";

class Model {
    constructor() {
        this.star_data_lis = [];
        this.russia_data_list = [];
        this.haul_data_list = [];
        this.digit_data_list = [];
        this.union_data_list = [];
        this.pop_data_list = [];

        this.my_data_table = {};
    }

    get star() {
        return this.star_data_list;
    }
    get russia() {
        return this.russia_data_list;
    }
    get haul() {
        return this.haul_data_list;
    }
    get digit() {
        return this.digit_data_list;
    }
    get union() {
        return this.union_data_list;
    }
    get pop() {
        return this.pop_data_list;
    }

    get my_data() {
        return this.my_data_table;
    }

    updateMyData(data) {
        let me = data[0];
        this.my_data_table = {
            avatarUrl: me.avatarUrl,
            openid: me.openId,
            nickname: me.nickName,
            gender: me.gender,
            city: me.city,
            province: me.province,
            country: me.country,
            language: me.language,
        };
    }

    isSelf(data) {
        return data.avatarUrl === this.my_data_table.avatarUrl && 
            data.nickName === this.my_data_table.nickName;
    }

    parseKVData(kvlist) {
        let ret = {};
        for (let i = 0, kv; i < kvlist.length; i++) {
            kv = kvlist[i];
            ret[kv.key] = (kv.value === null || kv.value === undefined) && "0" || kv.value;
        }
        return ret;
    }

    parseItemData(item) {
        let kvdata = this.parseKVData(item.KVDataList);

        let data = {};
        data.openid = item.openid;
        data.nickname = item.nickname;
        data.avatarUrl = item.avatarUrl;
        for (let k in kvdata) {
            data[k] = kvdata[k];
        }

        return data;
    }

    updateStarData(data) {
        this.star_data_list = [];
        for (let i = 0, item; i < data.length; i++) {
            item = this.parseItemData(data[i]);
            if (item[cfg.VITAL_KEY.STAR]) {
                if (util.isSameWeek(Number(item[cfg.VITAL_TIME.STAR]))) {
                    item[cfg.VITAL_KEY.STAR] = Number(item[cfg.VITAL_KEY.STAR]);
                }
                else {
                    item[cfg.VITAL_KEY.STAR] = 0;
                }
                this.star_data_list.push(item);
            }
        }

        this.star_data_list.sort((a, b)=>{
            return b[cfg.VITAL_KEY.STAR] - a[cfg.VITAL_KEY.STAR];
        });
    }

    updateRussiaData(data) {
        this.russia_data_list = [];
        for (let i = 0, item; i < data.length; i++) {
            item = this.parseItemData(data[i]);
            if (item[cfg.VITAL_KEY.RUSSIA]) {
                if (util.isSameWeek(Number(item[cfg.VITAL_TIME.RUSSIA]))) {
                    item[cfg.VITAL_KEY.RUSSIA] = Number(item[cfg.VITAL_KEY.RUSSIA]);
                }
                else {
                    item[cfg.VITAL_KEY.RUSSIA] = 0;
                }
                this.russia_data_list.push(item);
            }
        }
        this.russia_data_list.sort((a, b)=>{
            return b[cfg.VITAL_KEY.RUSSIA] - a[cfg.VITAL_KEY.RUSSIA];
        });
    }

    updateHaulData(data) {
        this.haul_data_list = [];
        for (let i = 0, item; i < data.length; i++) {
            item = this.parseItemData(data[i]);
            if (item[cfg.VITAL_KEY.RUSSIA]) {
                if (util.isSameWeek(Number(item[cfg.VITAL_TIME.HAUL]))) {
                    item.haul_score = Number(item[cfg.VITAL_KEY.HAUL]);
                    this.haul_data_list.push(item);
                }
            }
        }
        this.haul_data_list.sort((a, b)=>{
            return b.haul_score - a.haul_score;
        });
    }

    updateDigitData(data) {
        this.digit_data_list = [];
        for (let i = 0, item; i < data.length; i++) {
            item = this.parseItemData(data[i]);
            if (util.isSameWeek(Number(item.digit_time))) {
                item.digit_score = Number(item.digit_score);
                this.digit_data_list.push(item);
            }
        }
        this.digit_data_list.sort((a, b)=>{
            return b.digit_score - a.digit_score;
        });
    }

    updateUnionData(data) {
        this.union_data_list = [];
        for (let i = 0, item; i < data.length; i++) {
            item = this.parseItemData(data[i]);
            if (item[cfg.VITAL_KEY.UNION]) {
                if (util.isSameWeek(Number(item[cfg.VITAL_TIME.UNION]))) {
                    item[cfg.VITAL_KEY.UNION] = Number(item[cfg.VITAL_KEY.UNION]);
                }
                else {
                    item[cfg.VITAL_KEY.UNION] = 0;
                }
                this.union_data_list.push(item);
            }
        }

        this.union_data_list.sort((a, b)=>{
            return b[cfg.VITAL_KEY.UNION] - a[cfg.VITAL_KEY.UNION];
        });
    }

    updatePopData(data) {
        this.pop_data_list = [];
        for (let i = 0, item; i < data.length; i++) {
            item = this.parseItemData(data[i]);
            if (util.isSameWeek(Number(item.pop_time))) {
                item.pop_score = Number(item.pop_score);
                this.pop_data_list.push(item);
            }
        }
        this.pop_data_list.sort((a, b)=>{
            return b.pop_score - a.pop_score;
        });
    }
}

export default new Model;
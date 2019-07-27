
import cfg from "./config";

let LOCAL_IMG_LIST = [
    cfg.IMG_ITEM_BG,
];

class Util {

    constructor() {
        this.day_time = 1000 * 60 * 60 * 24;
        this.image_cache = {};
        this.avatar_image_cache = {};
    }

    initLocalImage() {
        for (let i = 0, url; i < LOCAL_IMG_LIST.length; i++) {
            url = LOCAL_IMG_LIST[i];
            this.image_cache[url] = this.createImage(url);
        }
    }

    getImage(name) {
        return this.image_cache[name];
    }

    createImage(url, onload) {
        let image = wx.createImage();
        image.src = url;
        image.onload = ()=>{
            onload && onload(image);
        };
        return image;
    }

    getAvatarImage(name, cb) {
        if (this.avatar_image_cache[name]) {
            cb && cb(this.avatar_image_cache[name]);
        }
        else {
            this.createImage(name, (image)=>{
                this.avatar_image_cache[name] = image;
                cb && cb(image);
            })
        }
    }

    measureText(ctx, text) {
        let s = ctx.measureText(text);
        if (s) {
            return s.width;
        }
        return 0;
    }

    getFriendCloudStorage(klist, cb) {
        wx.getFriendCloudStorage({
            keyList: klist,
            success: (res) => {
                cb && cb(res.data);
            },
            fail: () => {
                setTimeout(() => {
                    this.getFriendCloudStorage(klist);
                }, 100);
            }
        });
    }

    getGroupCloudStorage(klist, ticket, cb) {
        wx.getGroupCloudStorage({
            shareTicket: ticket,
            keyList: klist,
            success: (res) => {
                cb && cb(res.data);
            },
            fail: () => {
                setTimeout(() => {
                    this.getGroupCloudStorage(klist);
                }, 100);
            }
        });
    }

    isSameWeek(old_time, now_time) {
        old_time = old_time || new Date().getTime();
        now_time = now_time || new Date().getTime();

        let old_day = ~~(old_time / this.day_time);
        let now_day = ~~(now_time / this.day_time);

        return (~~((old_day + 4) / 7)) === (~~((now_day + 4) / 7));
    }

    test() {
        console.log(this.image_cache);
    }
}

export default new Util;
/*
资源管理器
统一处理资源的加载
*/

cc.Class({
    properties: {
        _loadded_module: { default: {} },

        _sprite_atlas: { default: {} },

        _sprite_frames: { default: {} },
    },

    //获取指定模块的资源列表
    getResList(parent, modules) {
        let ret = [];

        !modules && (modules = parent, parent = ya.resclassify);
        
        if (typeof modules === "string") {
            ret = ya.utils.clone(parent[modules]);
        }
        else {
            for (let i = 0; i < modules.length; i++) {
                ret = ret.concat(this.getResList(parent, modules[i]));
            }
        }

        return ret;
    },

    splitPathAndType(res) {
        let path = [], type = [];

        for (let i = 0; i < res.length; i++) {
            if (typeof res[i] === "string") {
                path[i] = res[i];
            }
            else {
                path[i] = res[i][0];
                type[i] = res[i][1];
            }
        }

        return [path, type];
    },

    //加载纹理缓存
    load(modules, iterator, complete) {

        iterator || (iterator = function () { });
        complete || (complete = function () { });

        //显示加载百分比
        let funcPercent = (percent) => {
            if (!this.isLoadded("global")) return;
            if (typeof module !== "string" || (module !== "global" && module !== "iloadding" && module !== "maineffect")) {
                ya.event.dispatchEvent(ya.ekey.SHOW_WAITING, { txt: ya.txt.net002 + percent + "%", isAutoDestroy: false });
            }
        }

        //加载回调
        let iteratorFunc = () => (result, count, total) =>{
            if (iterator) iterator(result, count, total);
            funcPercent(Math.ceil(count / total * 100));
        }

        funcPercent(0);	//显示加载百分比为0

        let res_list = this.splitPathAndType(this.getResList(modules));

        cc.loader.loadResArray(res_list[0], res_list[1], (count, total, result) => {
            this.loadIterator(result, count, total, iteratorFunc);
        }, (errors, resources) => {
            if (!!errors) {
                this.load(modules, iterator, complete);
            }
            else {
                this.loadComplete(resources, modules, complete);
            }
        });
    },

    //下载的迭代器
    loadIterator(count, total, result, iterator) {
        //下载出错
        if (!result) {

        }
        else {
            if (iterator) iterator(count, total, result);
        }
    },

    //下载完成的回调
    loadComplete(resources, modules, complete) {
        ya.event.dispatchEvent(ya.ekey.REMOVE_WAITING);

        this.setLoadded(modules, true);

        this.setResourceLoadded(resources);

        if (complete) complete();
    },

    setLoadded(modules, loadded) {
        typeof modules === "string" && (modules = [modules]);
        
        for (let i = 0; i < modules.length; i++) {
            this._loadded_module[modules[i]] = loadded;
        }
    },

    //获取某个模块是否加载完成
    isLoadded(modules) {
        typeof modules === "string" && (modules = [modules]);

        for (let i = 0; i < modules.length; i++) {
            if (!this._loadded_module[modules[i]]) {
                return false;
            }
        }

        return true;
    },

    //检查并加载指定的模块
    checkLoad(modules, iterator, callback) {
        !callback && (callback = iterator, iterator = null);

        if (this.isLoadded(modules)) {
            callback();
        }
        else {
            this.load(modules, iterator, callback);
        }
    },

    setResourceLoadded(resources) {
        if (!resources || resources.length <= 0) return;
        
        resources.forEach(item => {
            if (item instanceof cc.SpriteAtlas) {
                this._sprite_atlas[item.name] = item;

                let sprite_frames = item.getSpriteFrames();
                for (let k in sprite_frames) {
                    let sf = sprite_frames[k];
                    this._sprite_frames[sf.name] = sf;
                }
            }
        });
    },

    //参数说明
    //atlas: ya.res中的定义
    //name: ya.tex中的定义
    getSpriteFrame(atlas, name) {
        //如果只传了一个参数默认是直接获取精灵
        if (!name) {
            return this._sprite_frames[atlas];
        }

        let realatlas = cc.path.basename(cc.path.mainFileName(atlas)) + ".plist";
        if (this._sprite_atlas[realatlas]) {
            return this._sprite_atlas[realatlas].getSpriteFrame(name);
        }
    },
});
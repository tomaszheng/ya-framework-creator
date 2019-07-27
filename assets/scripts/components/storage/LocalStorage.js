
/*
本地存储
*/

cc.Class({

    _isEmpty(value) {
        return value === null || value === "" || value === undefined;
    },

    set(key, value) {
        if (!key) {
            cc.warn("[error in LocalStorage set func]: key is null");
            return;
        }

        if (this._isEmpty(value)) {
            value = "0";
        }
        else if (typeof value === "number") {
            value = value.toString();
        }
        else if (typeof value === "boolean") {
            value = (value ? 1 : 0).toString();
        }
        else if (typeof value === "object") {
            value = JSON.stringify(value);
        }

        cc.sys.localStorage.setItem(key, value);
    },

    clean(key) {
        if (!key) {
            cc.warn("[error in LocalStorage clean func]: key is null");
            return;
        }

        cc.sys.localStorage.setItem(key, null);
    },

    //获取number类型值
    int(key, default_value) {
        if (!key) {
            cc.error("[error in LocalStorage int func]: key is null");
            return default_value || 0;
        }

        let value = cc.sys.localStorage.getItem(key);
        if (this._isEmpty(value)) {
            value = default_value;
        }
        else {
            value = Number(value);
        }

        return value;
    },

    //获取Boolean类型值
    bool(key, default_value) {
        if (!key) {
            cc.error("[error in LocalStorage bool func]: key is null");
            return default_value || false;
        }

        let value = cc.sys.localStorage.getItem(key);
        if (this._isEmpty(value)) {
            value = default_value;
        }
        else {
            value = Boolean(Number(value));
        }

        return value;
    },

    //获取string类型值
    str(key, default_value) {
        if (!key) {
            cc.error("[error in LocalStorage str func]: key is null");
            return default_value || "";
        }

        let value = cc.sys.localStorage.getItem(key);
        if (this._isEmpty(value)) {
            value = default_value;
        }

        return value;
    },

    //获取object类型值
    obj(key, default_value) {
        if (!key) {
            cc.error("[error in LocalStorage obj func]: key is null");
            return default_value;
        }

        let value = cc.sys.localStorage.getItem(key);
        if (this._isEmpty(value)) {
            value = default_value;
        }
        else {
            try {
                value = JSON.parse(value);
            } catch (error) { //纯字符串JSON.parse会报错,例如"dd"
                value = default_value;
            }
        }

        return value;
    },
});
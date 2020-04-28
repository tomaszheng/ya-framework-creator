
/*
本地存储
*/

const {ccclass, property} = cc._decorator;

@ccclass
export default class YALocalStorage {

    private static _instance: YALocalStorage = null;
    static getInstance(): YALocalStorage {
        if (this._instance) {
            this._instance = new YALocalStorage();
        }
        return this._instance;
    }

    _isEmpty (value: any) {
        return value === null || value === "" || value === undefined;
    }

    set (key: string, value: number|boolean|object|string|null): void {
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
    }

    clean (key: string) {
        cc.sys.localStorage.setItem(key, null);
    }

    int (key:string, defaultValue?: number|null|undefined): number {
        let value = cc.sys.localStorage.getItem(key);
        if (this._isEmpty(value)) {
            if (this._isEmpty(defaultValue)) {
                value = 0;
            }
            else {
                value = defaultValue;
            }
        }
        else {
            value = Number(value);
        }

        return value;
    }

    bool (key: string, defaultValue?: boolean|null|undefined): boolean {
        let value = cc.sys.localStorage.getItem(key);
        if (this._isEmpty(value)) {
            if (this._isEmpty(defaultValue)) {
                value = false;
            }
            else {
                value = defaultValue;
            }
        }
        else {
            value = Boolean(Number(value));
        }

        return value;
    }

    str (key: string, defaultValue?: string|null|undefined): string {
        let value = cc.sys.localStorage.getItem(key);
        if (this._isEmpty(value)) {
            if (this._isEmpty(defaultValue)) {
                value = "";
            }
            else {
                value = defaultValue;
            }
        }

        return value;
    }

    obj (key: string, defaultValue?: any): any {
        let value = cc.sys.localStorage.getItem(key);
        if (this._isEmpty(value)) {
            value = defaultValue;
        }
        else {
            try {
                value = JSON.parse(value);
            } catch (error) { //纯字符串JSON.parse会报错,例如"dd"
                value = defaultValue;
            }
        }

        return value;
    }
}
import {Singleton} from "../singleton/Singleton";

class YaLocalStorage extends Singleton<YaLocalStorage> {
    private static _isEmpty(value: any) {
        return value === null || value === "" || value === undefined;
    }

    public setItem(key: string, value: number | boolean | object | string | null): void {
        let valueStr = "";
        if (YaLocalStorage._isEmpty(value)) {
            valueStr = "";
        } else if (typeof value === "number") {
            valueStr = value.toString();
        } else if (typeof value === "boolean") {
            valueStr = (value ? 1 : 0).toString();
        } else if (typeof value === "object") {
            valueStr = JSON.stringify(value);
        }

        cc.sys.localStorage.setItem(key, valueStr);
    }

    public clear(key: string) {
        cc.sys.localStorage.setItem(key, null);
    }

    public getInt(key: string, defaultValue?: number): number {
        let value = cc.sys.localStorage.getItem(key);
        if (YaLocalStorage._isEmpty(value)) {
            if (YaLocalStorage._isEmpty(defaultValue)) {
                value = 0;
            } else {
                value = defaultValue;
            }
        } else {
            value = Number(value);
        }

        return value;
    }

    public getBool(key: string, defaultValue?: boolean): boolean {
        let value = cc.sys.localStorage.getItem(key);
        if (YaLocalStorage._isEmpty(value)) {
            if (YaLocalStorage._isEmpty(defaultValue)) {
                value = false;
            } else {
                value = defaultValue;
            }
        } else {
            value = Boolean(Number(value));
        }

        return value;
    }

    public getString(key: string, defaultValue?: string): string {
        let value = cc.sys.localStorage.getItem(key);
        if (YaLocalStorage._isEmpty(value)) {
            if (YaLocalStorage._isEmpty(defaultValue)) {
                value = "";
            } else {
                value = defaultValue;
            }
        }

        return value;
    }

    public getObject(key: string, defaultValue?: any): any {
        let value = cc.sys.localStorage.getItem(key);
        if (YaLocalStorage._isEmpty(value)) {
            value = defaultValue;
        } else {
            try {
                value = JSON.parse(value);
            } catch (error) { // 纯字符串JSON.parse会报错,例如"dd"
                value = defaultValue;
            }
        }

        return value;
    }
}

const yaLocalStorage = YaLocalStorage.instance(YaLocalStorage);
export {yaLocalStorage};
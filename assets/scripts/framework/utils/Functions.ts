import {lodash} from "../libs/lib";

class Functions {
    public static mix(arr: any[]) {
        const len = arr.length;
        for (let i = 0; i < len; i++) {
            lodash.swap(arr, i, lodash.random(0, len - 1));
        }
    }

    public static isValid(v: any): boolean {
        return !(v === null || v === undefined);
    }
}

const functions = Functions;
export {functions};

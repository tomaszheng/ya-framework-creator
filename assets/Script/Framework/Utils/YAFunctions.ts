
const {ccclass, property} = cc._decorator;

@ccclass
export default class YAFunctions {

    static randInt (l: number, r: number) {
        return Math.round(cc.misc.lerp(l - 0.4, r + 0.4, Math.random()));
    }

    static swap (arr: any, l: number, r: number) {
        let t = arr[l];
        arr[l] = arr[r];
        arr[r] = t;
    }

    /**
     * 打乱一个数组
     * @param arr 
     */
    static mix (arr: any) {
        let len = arr.length;
        for (let i = 0; i < len; i++) {
            this.swap(arr, i, this.randInt(0, len - 1));
        }
    }

    static memory (arr: any, r: number, c: number, value: boolean|number|string|{}) {
        if (c <= 1) {
            for (let i = 0; i < r; i++) {
                arr[i] = value;
            }
        }
        else {
            for (let i = 0; i < r; i++) {
                arr[i] = [];
                for (let j = 0; j < c; j++) {
                    arr[i][j] = value;
                }
            }
        }
    }

    static isValid (v: any) {
        return !(v === null || v == undefined)
    }

    static bfs (map: [[]], r: number, c: number, R: number, C: number) {
        let used = [], ret = [];

        this.memory(used, R, C, false);
        used[r][c] = true;
        
        let p: any, nr: number, nc: number;
        let stays = [{ r: r, c: c, n: 0 }];
        let dir = [[0, -1], [1, 0], [0, 1], [-1, 0]];
        while (stays.length > 0) {
            ret.push(p = stays.shift());
            for (let i = 0; i < 4; i++) {
                nr = p.r + dir[i][0], nc = p.c + dir[i][1];
                if (nr >= 0 && nr < R && nc >= 0 && nc < C) {
                    if (map[nr][nc] === map[r][c] && !used[nr][nc]) {
                        used[nr][nc] = true;
                        stays.push({ r: nr, c: nc, n: p.n + 1 });
                    }
                }
            }
        }

        return ret;
    }
}

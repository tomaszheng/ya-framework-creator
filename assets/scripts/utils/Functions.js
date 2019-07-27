
cc.Class({

    randInt(l, r) {
        return Math.round(cc.misc.lerp(l - 0.4, r + 0.4, Math.random()));
    },

    mix(arr) {
        let len = arr.length;
        for (let i = 0, t, r; i < len; i++) {
            r = this.randInt(0, len - 1);
            t = arr[i], arr[i] = arr[r], arr[r] = t;
        }
    },

    bfs(map, r, c, R, C) {
        let used = [], ret = [];
        for (let i = 0; i < R; i++) {
            used[i] = [];
            for (let j = 0; j < C; j++) {
                used[i][j] = false;
            }
        }
        used[r][c] = true;
        
        let p, nr, nc;
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
    },

});
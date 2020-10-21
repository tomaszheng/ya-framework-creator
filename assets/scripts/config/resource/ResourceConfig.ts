
/*
资源模块分类，用于模块资源加载
*/

const C: any = {};

C.base64_cube_square = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACAQMAAABIeJ9nAAAAA1BMVEX///+nxBvIAAAACklEQVQI12MAAgAABAABINItbwAAAABJRU5ErkJggg==";

C.main = [
    ["module/game/game", cc.SpriteAtlas],
    "prefab/main",
    ["sound/click", cc.AudioClip],
    ["sound/bgm",   cc.AudioClip],
];

C.revive = [
    "prefab/dialog_revive"
];

C.pause = [
    "prefab/dialog_pause",
];

C.settle = [
    "prefab/dialog_settle",
];

C.rank = [
    "prefab/rank",
];

C.archive = [
    "prefab/dialog_archive",
];

const ResourceConfig = C;
export default {ResourceConfig};


/*
资源模块分类，用于模块资源加载
*/

let C: any = {};

C.base64_cube_square = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACAQMAAABIeJ9nAAAAA1BMVEX///+nxBvIAAAACklEQVQI12MAAgAABAABINItbwAAAABJRU5ErkJggg==";

C.main = [
    ["Module/Game/Game", cc.SpriteAtlas],
    "Prefab/main",
    ["Sound/click", cc.AudioClip],
    ["Sound/bgm",   cc.AudioClip],
];

C.game_star = [
    ["Module/Game/Game",        cc.SpriteAtlas],
    ["Module/Common/Common",    cc.SpriteAtlas],
    "Prefab/game_star",
    "Prefab/game_star_item",
    ["Sound/star_erase",        cc.AudioClip],
    ["Sound/star_multi",        cc.AudioClip],
    ["Sound/star_award_erase",  cc.AudioClip],
    ["Sound/star_fadein",       cc.AudioClip],
    ["Sound/die",               cc.AudioClip],
    ["Sound/star_like_1",       cc.AudioClip],
    ["Sound/star_like_2",       cc.AudioClip],
    ["Sound/star_like_23",      cc.AudioClip],
    "Prefab/dialog_item",
];

C.game_russia = [
    ["Module/Game/Game",        cc.SpriteAtlas],
    ["Module/Common/Common",    cc.SpriteAtlas],
    "Prefab/game_russia",
];

C.game_haul = [
    ["Module/Game/Game",        cc.SpriteAtlas],
    ["Module/Common/Common",    cc.SpriteAtlas],
    "Prefab/game_haul",
];

C.game_union = [
    ["Module/Game/Game",        cc.SpriteAtlas],
    ["Module/Common/Common",    cc.SpriteAtlas],
    "Prefab/game_union",
    "Prefab/game_star_item",
    "Prefab/dialog_item",
    ["Sound/star_like_1",       cc.AudioClip],
    ["Sound/star_like_2",       cc.AudioClip],
    ["Sound/star_like_23",      cc.AudioClip],
];

C.revive = [
    "Prefab/dialog_revive"
];

C.pause = [
    "Prefab/dialog_pause",
];

C.settle = [
    "Prefab/dialog_settle",
];

C.rank = [
    "Prefab/rank",
];

C.archive = [
    "Prefab/dialog_archive",
];

let ResourceConfig = C;
export default ResourceConfig;
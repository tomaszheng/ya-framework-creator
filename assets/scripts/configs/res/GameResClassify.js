
/*
资源模块分类，用于模块资源加载
*/

let res = require("./GameRes");

let C = {};

C.main = [
    [res.game, cc.SpriteAtlas],
    res.prefab_main,
    [res.sound_click, cc.AudioClip],
    [res.sound_bgm, cc.AudioClip],
];

C.global = [

];

C.game_star = [
    [res.game, cc.SpriteAtlas],
    [res.unity, cc.SpriteAtlas],
    res.prefab_game_star,
    res.prefab_game_star_item,
    [res.sound_star_erase, cc.AudioClip],
    [res.sound_star_via, cc.AudioClip],
    [res.sound_star_award_erase, cc.AudioClip],
    [res.sound_star_fadein, cc.AudioClip],
    [res.sound_die, cc.AudioClip],
    [res.sound_like_1, cc.AudioClip],
    [res.sound_like_2, cc.AudioClip],
    [res.sound_like_3, cc.AudioClip],
    res.prefab_item,
];

C.game_russia = [
    [res.game, cc.SpriteAtlas],
    [res.unity, cc.SpriteAtlas],
    res.prefab_game_russia,
];

C.game_haul = [
    [res.game, cc.SpriteAtlas],
    [res.unity, cc.SpriteAtlas],
    res.prefab_game_haul,
];

C.game_union = [
    [res.game, cc.SpriteAtlas],
    [res.unity, cc.SpriteAtlas],
    res.prefab_game_union,
    res.prefab_game_star_item,
    res.prefab_item,
    [res.sound_like_1, cc.AudioClip],
    [res.sound_like_2, cc.AudioClip],
    [res.sound_like_3, cc.AudioClip],
];

C.revive = [
    res.prefab_revive,
];

C.pause = [
    res.prefab_pause,
];

C.settle = [
    res.prefab_settle,
];

C.rank = [
    res.prefab_rank,
];

C.archive = [
    res.prefab_archive,
];

export default C;
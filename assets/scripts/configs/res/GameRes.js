
/*
资源配置文件
*/

let prefab = "prefabs/";
let texture = "textures/";
let sound = "sounds/";

let R = {};

R.image_share_common = "images/common_share_img.jpg";
R.image_share_revive = "images/revive_share_img.jpg";
R.image_share_settle = "images/settle_share_img.jpg";
R.image_pure = "images/img_pure.png";

R.prefab_game_star = prefab + "game_star";
R.prefab_game_star_item = prefab + "game_star_item";
R.prefab_game_russia = prefab + "game_russia";
R.prefab_game_haul = prefab + "game_haul";
R.prefab_game_union = prefab + "game_union";
R.prefab_revive = prefab + "dialog_revive";
R.prefab_pause = prefab + "dialog_pause";
R.prefab_settle = prefab + "dialog_settle";
R.prefab_archive = prefab + "dialog_archive";
R.prefab_item = prefab + "dialog_item";
R.prefab_main = prefab + "main";
R.prefab_rank = prefab + "rank";

R.sound_click = sound + "click";
R.sound_star_erase = sound + "star_erase";
R.sound_star_via = sound + "star_via";
R.sound_star_multi = sound + "star_multi";
R.sound_star_award_erase = sound + "star_award_erase";
R.sound_star_fadein = sound + "star_fadein";
R.sound_die = sound + "die";
R.sound_like_1 = sound + "star_like_1";
R.sound_like_2 = sound + "star_like_2";
R.sound_like_3 = sound + "star_like_3";
R.sound_bgm = sound + "bgm";

R.game = texture + "game/game";
R.unity = texture + "unity/unity";

export default R;
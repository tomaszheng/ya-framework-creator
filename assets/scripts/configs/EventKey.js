
/*
事件派发关键字的定义
*/

let __uuid = 0;
let uuid = ()=>{
    return "ekey" + (__uuid++).toString();
};

let E = {};

E.NET_CONNECTED = uuid(); //网络链接成功

E.ON_SHOW = uuid(); //切前台
E.ON_HIDE = uuid(); //切后台

E.SHOW_WAITING = uuid(); //显示等待
E.REMOVE_WAITTING = uuid(); //移除等待
E.SHOW_PROMPT_DIALOG = uuid(); //显示通用提示弹窗

E.EVT_SHOW_REVIVE = uuid();
E.EVT_SHOW_PAUSE = uuid();
E.EVT_SHOW_SETTLE = uuid();
E.EVT_SHOW_ARCHIVE = uuid();
E.EVT_SHOW_ITEM = uuid();
E.EVT_SHOW_BASKET = uuid();

E.SHOW_TOAST = uuid(); //显示提示

E.EVT_GAME_EXIT = uuid();
E.EVT_GAME_OVER = uuid();
E.EVT_GAME_USE_DYE = uuid();
E.EVT_GAME_USE_BOMB = uuid();
E.EVT_GAME_SHOW_ITEM = uuid();
E.EVT_GAME_ITEM_LACK = uuid(); //道具不足

E.MD_GAME_GOAL_CHANGE = uuid();
E.MD_GAME_LEVEL_CHANGE = uuid();
E.MD_GAME_SCORE_CHANGE = uuid();
E.MD_ITEM_NUM_CHANGE = uuid(); //道具数量改变
E.EVT_USE_ITEM_DYE = uuid(); //使用了道具：换色
E.EVT_USE_ITEM_BOMB = uuid(); //使用了道具：炸弹

E.EVT_RUSSIA_GAME_OVER = uuid();
E.MD_RUSSIA_SCORE_CHANGE = uuid();
E.MD_RUSSIA_SHAPE_CHANGE = uuid();

E.EVT_UNION_SHOW_ITEM = uuid();
E.EVT_UNION_GAME_OVER = uuid();
E.MD_UNION_SCORE_CHANGE = uuid();
E.MD_UNION_GOAL_CHANGE = uuid();

export default E;
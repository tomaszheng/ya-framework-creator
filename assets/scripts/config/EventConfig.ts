
/*
事件派发关键字的定义
*/

let __uuid = 0;
let uuid = () => {
    return "ekey" + (__uuid++).toString();
}

const EventConfig = {
    NET_CONNECTED: uuid(), //网络链接成功

    ON_SHOW: uuid(), // 切前台
    ON_HIDE: uuid(), // 切后台

    SHOW_TOAST: uuid(),         // 显示toast
    SHOW_WAITING: uuid(),       // 显示等待
    REMOVE_WAITTING: uuid(),    // 移除等待
    SHOW_PROMPT_DIALOG: uuid(), // 显示通用提示弹窗

    EVT_SHOW_REVIVE: uuid(),
    EVT_SHOW_PAUSE: uuid(),
    EVT_SHOW_SETTLE: uuid(),
    EVT_SHOW_ARCHIVE: uuid(),
    EVT_SHOW_ITEM: uuid(),
    EVT_SHOW_BASKET: uuid(),

    EVT_GAME_EXIT: uuid(),
    EVT_GAME_OVER: uuid(),
    EVT_GAME_USE_DYE: uuid(),
    EVT_GAME_USE_BOMB: uuid(),
    EVT_GAME_SHOW_ITEM: uuid(),
    EVT_GAME_ITEM_LACK: uuid(), //道具不足

    MD_GAME_GOAL_CHANGE: uuid(),
    MD_GAME_LEVEL_CHANGE: uuid(),
    MD_GAME_SCORE_CHANGE: uuid(),
    MD_ITEM_NUM_CHANGE: uuid(), //道具数量改变
    EVT_USE_ITEM_DYE: uuid(), //使用了道具：换色
    EVT_USE_ITEM_BOMB: uuid(), //使用了道具：炸弹

    EVT_RUSSIA_GAME_OVER: uuid(),
    MD_RUSSIA_SCORE_CHANGE: uuid(),
    MD_RUSSIA_SHAPE_CHANGE: uuid(),

    EVT_UNION_SHOW_ITEM: uuid(),
    EVT_UNION_GAME_OVER: uuid(),
    MD_UNION_SCORE_CHANGE: uuid(),
    MD_UNION_GOAL_CHANGE: uuid(),
}

export { EventConfig }
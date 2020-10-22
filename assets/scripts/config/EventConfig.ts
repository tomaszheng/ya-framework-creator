
/*
事件派发关键字的定义
*/

let uuid = 0;
const nextUuid = () => {
    return "eKey" + (uuid++).toString();
};

const EventConfig = {
    NET_CONNECTED: nextUuid(), // 网络链接成功

    ON_SHOW: nextUuid(), // 切前台
    ON_HIDE: nextUuid(), // 切后台

    SHOW_TOAST: nextUuid(),         // 显示toast
    SHOW_WAITING: nextUuid(),       // 显示等待
    REMOVE_WAITING: nextUuid(),    // 移除等待
    SHOW_PROMPT_DIALOG: nextUuid(), // 显示通用提示弹窗

    EVT_SHOW_REVIVE: nextUuid(),
    EVT_SHOW_PAUSE: nextUuid(),
    EVT_SHOW_SETTLE: nextUuid(),
    EVT_SHOW_ARCHIVE: nextUuid(),
    EVT_SHOW_ITEM: nextUuid(),
    EVT_SHOW_BASKET: nextUuid(),

    EVT_GAME_EXIT: nextUuid(),
    EVT_GAME_OVER: nextUuid(),
    EVT_GAME_USE_DYE: nextUuid(),
    EVT_GAME_USE_BOMB: nextUuid(),
    EVT_GAME_SHOW_ITEM: nextUuid(),
    EVT_GAME_ITEM_LACK: nextUuid(), // 道具不足

    MD_GAME_GOAL_CHANGE: nextUuid(),
    MD_GAME_LEVEL_CHANGE: nextUuid(),
    MD_GAME_SCORE_CHANGE: nextUuid(),
    MD_ITEM_NUM_CHANGE: nextUuid(), // 道具数量改变
    EVT_USE_ITEM_DYE: nextUuid(), // 使用了道具：换色
    EVT_USE_ITEM_BOMB: nextUuid(), // 使用了道具：炸弹

    EVT_RUSSIA_GAME_OVER: nextUuid(),
    MD_RUSSIA_SCORE_CHANGE: nextUuid(),
    MD_RUSSIA_SHAPE_CHANGE: nextUuid(),

    EVT_UNION_SHOW_ITEM: nextUuid(),
    EVT_UNION_GAME_OVER: nextUuid(),
    MD_UNION_SCORE_CHANGE: nextUuid(),
    MD_UNION_GOAL_CHANGE: nextUuid(),
};

export { EventConfig };

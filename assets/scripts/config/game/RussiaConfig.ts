
let RC: any = {};

RC.NONE = 0;
RC.RED = 1;
RC.ORANGE = 2;
RC.YELLOW = 3;
RC.GREEN = 4;
RC.BLUE = 5;

RC.COLOR_LIST = [RC.RED, RC.ORANGE, RC.YELLOW, RC.GREEN, RC.BLUE];

RC.COLOR = {
    [RC.RED]: cc.color(237, 66, 75),
    [RC.ORANGE]: cc.color(242, 84, 219),
    [RC.YELLOW]: cc.color(241, 160, 10),
    [RC.GREEN]: cc.color(65, 184, 4),
    [RC.BLUE]: cc.color(22, 142, 231),
};

RC.SHAPE0 = 0;
RC.SHAPE1 = 1; // .
RC.SHAPE2 = 2; // ...
RC.SHAPE3 = 3; // :..
RC.SHAPE4 = 4; // ..:
RC.SHAPE5 = 5; // .:.
RC.SHAPE6 = 6; // .:'
RC.SHAPE7 = 7; // ':.
RC.SHAPE8 = 8; // ::

RC.SHAPES = [
    RC.SHAPE1,
    RC.SHAPE2,
    RC.SHAPE3,
    RC.SHAPE4,
    RC.SHAPE5,
    RC.SHAPE6,
    RC.SHAPE7,
    RC.SHAPE8
];
RC.SHAPE_LEN = RC.SHAPES.length;

RC.ROW = 20;
RC.COLUMN = 10;

RC.WIDTH = 45;
RC.GAP = 5;
RC.BORDER = 10;

RC.U_ROW = 3;
RC.U_COLUMN = 3;
RC.U_WIDTH = 145;

RC.SHAPE_COLUMN_INDEX = 4;

RC.MOVE_DIS_X = 10;
RC.MOVE_DIS_Y = 10;

RC.STATUS = {
    NONE: 0,
    PLAYING: 1,
    PAUSE: 2,
    ERASING: 3,
    OVER: 4,
};

RC.REVIVE_ROW = 8;

RC.SCORE_INC = 10;

RC.REVIVE_NUM = 2;
RC.REVIVE_MAX_SHARE = 6; // 最多分享复活几次

RC.GOAL_AWARD_SCORE = 2e4;
RC.GOAL_AWARD_SCORE_INC = 1e4;

const RussiaConfig = RC;
export { RussiaConfig };

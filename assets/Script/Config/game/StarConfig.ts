
let SC: any = {};

SC.NONE = 0;
SC.RED = 1;
SC.ORANGE = 2;
SC.YELLOW = 3;
SC.GREEN = 4;
SC.BLUE = 5;

SC.COLOR_LIST = [SC.RED, SC.ORANGE, SC.YELLOW, SC.GREEN, SC.BLUE];

SC.COLOR = {
    [SC.RED]: cc.color(237, 66, 75),
    [SC.ORANGE]: cc.color(242, 84, 219),
    [SC.YELLOW]: cc.color(241, 160, 10),
    [SC.GREEN]: cc.color(65, 184, 4),
    [SC.BLUE]: cc.color(22, 142, 231),
};

SC.DIR = [
    { x: 0, y: 1 },
    { x: 1, y: 0 },
    { x: 0, y: -1 },
    { x: -1, y: 0 },
];

SC.ROW = 10;
SC.COLUMN = 10;

SC.WIDTH = 64;
SC.GAP = 6;
SC.BORDER = 13;

SC.SCORE = 5;
SC.SCORE_INC = 10;

SC.GOAL = [1e3, 3e3, 4500, 6e3, 8e3, 1e4, 13e3, 16e3, 19e3, 22e3];
SC.GOAL_LEN = SC.GOAL.length;
SC.GOAL_INC = 3500;

SC.AWARD = 2000;

SC.REVIVE_NUM = 2;
SC.REVIVE_MAX_SHARE = 6; //最多分享复活几次
SC.ITEM_NUM = 2;
SC.ITEM_MAX_SHARE = 10;

SC.GOAL_AWARD_SCORE = 2e4;
SC.GOAL_AWARD_SCORE_INC = 1e4;

let StarConfig = SC;
export default StarConfig;

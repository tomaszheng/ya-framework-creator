let UC: any = {};

UC.NONE = 0;
UC.RED = 1;
UC.YELLOW = 2;
UC.BLUE = 3;
UC.DARK = 4;

UC.COLOR_LIST = [UC.RED, UC.YELLOW, UC.BLUE];
UC.COLOR_LEN = 3;

UC.COLOR = {
    [UC.RED]: cc.color(237, 66, 75),
    [UC.YELLOW]: cc.color(241, 160, 10),
    [UC.BLUE]: cc.color(22, 142, 231),
    [UC.DARK]: cc.color(65, 4, 4),
};

UC.ROW = 6;
UC.COLUMN = 6;

UC.GOALS = [200, 500, 1e3, 1500, 2e3];
UC.GOAL_INC = 500;

UC.DIR = [
    { x: 0, y: 1 },
    { x: 1, y: 0 },
    { x: 0, y: -1 },
    { x: -1, y: 0 },
];

UC.BORDER = 20;
UC.GAP = 10;
UC.WIDTH = 105;
UC.MAX_NUM = 50;

UC.REVIVE_NUM = 2;
UC.REVIVE_MAX_SHARE = 6; // 最多分享复活几次
UC.ITEM_NUM = 2;
UC.ITEM_MAX_SHARE = 10;

UC.GOAL_AWARD_SCORE = 2e4;
UC.GOAL_AWARD_SCORE_INC = 1e4;

const UnionConfig = UC;
export default {UnionConfig};

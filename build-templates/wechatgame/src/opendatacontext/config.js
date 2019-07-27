
let C = {};

C.AC_INIT = 100;
C.AC_TEST = 101;
C.AC_STORAGE = 102;
C.AC_SCROLL_V = 103;
C.AC_SCROLL_H = 104;
C.AC_F_STAR_FETCH = 121;
C.AC_G_STAR_FETCH = 122;
C.AC_F_STAR_SETTLE = 123;
C.AC_F_RUSSIA_FETCH = 131;
C.AC_G_RUSSIA_FETCH = 132;
C.AC_F_RUSSIA_SETTLE = 133;
C.AC_F_HAUL_FETCH = 141;
C.AC_G_HAUL_FETCH = 142;
C.AC_F_DIGIT_FETCH = 151;
C.AC_G_DIGIT_FETCH = 152;
C.AC_F_UNION_FETCH = 161;
C.AC_G_UNION_FETCH = 162;
C.AC_F_UNION_SETTLE = 163;
C.AC_F_POP_FETCH = 171;
C.AC_G_POP_FETCH = 172;

C.GAP = 5;
C.ITEM_NUM = 6;
C.VIEW_WIDTH = 600;
C.VIEW_HEIGHT = 790;
C.ITEM_HEIGHT = 110;

C.VITAL_KEY = {}
C.VITAL_KEY.DEFAULT = "score";
C.VITAL_KEY.STAR = "star_score";
C.VITAL_KEY.RUSSIA = "russia_score";
C.VITAL_KEY.HAUL = "haul_score";
C.VITAL_KEY.UNION = "union_score";

C.VITAL_TIME = {};
C.VITAL_TIME.DEFAULT = "time";
C.VITAL_TIME.STAR = "star_time";
C.VITAL_TIME.RUSSIA = "russia_time";
C.VITAL_TIME.HAUL = "haul_time";
C.VITAL_TIME.UNION = "union_time";

C.IMG_ITEM_BG = "images/img_rank_item_bg.png";
// C.IMG_RANK_1 = "images/img_rank_1.png";
// C.IMG_RANK_2 = "images/img_rank_2.png";
// C.IMG_RANK_3 = "images/img_rank_3.png";

export default C;

import cfg from "./config";
import util from "./util.js";
import model from "./model";

class View {

    constructor() {
        this.view_width = 0;
        this.view_height = 0;
        this.item_height = 0;

        this.cur_offsety = 0;
        this.max_offsety = 0;

        this.rank_data = [];
        this.rank_len = 0;

        this.vital_key = "";

        this.canvas = wx.getSharedCanvas();
        let ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, 1080, 1920);
    }

    drawRankItem(index, rank, y) {
        let item_data = this.rank_data[rank];

        let h = (cfg.ITEM_HEIGHT + cfg.GAP) * index - y, dy = 20;

        let ctx = this.canvas.getContext('2d');
        //背景
        if (rank % 2 === 0) {
            ctx.drawImage(util.getImage(cfg.IMG_ITEM_BG), 0, h, cfg.VIEW_WIDTH, cfg.ITEM_HEIGHT);
        }

        util.getAvatarImage(item_data.avatarUrl, (image) => {
            ctx.drawImage(image, 75, h + dy, 80, 80);
        });

        ctx.font = "26px 微软雅黑";
        ctx.fillStyle = rank === 0 ? "rgb(250, 126, 1)" : rank < 3 ? "rgb(255,170,0)" : "rgb(80, 80, 80)";
        ctx.fillText(rank + 1, 25, h + 50 + dy); //排名

        let width = util.measureText(ctx, item_data.nickname);
        if (width > 190) {
            ctx.font = Math.floor(190 * 26 / s.width).toString() + "px 微软雅黑"
        }
        ctx.fillStyle = "rgb(80, 80, 80)";
        ctx.fillText(item_data.nickname, 180, h + 50 + dy); //昵称
        ctx.fillText(item_data[this.vital_key], 380, h + 50 + dy); //分数
    }


    drawSettleItem(index, rank) {
        let item_data = this.rank_data[rank];

        let x = index * 170, width;

        let ctx = this.canvas.getContext('2d');

        util.getAvatarImage(item_data.avatarUrl, (image) => {
            ctx.drawImage(image, x + 65, 35, 110, 110);
        });

        ctx.font = "25px 微软雅黑";
        ctx.fillStyle = "white";
        let srank = `第 ${rank + 1} 名`;
        width = util.measureText(ctx, srank);
        ctx.fillText(srank, x + 120 - width * 0.5, 25); //排名

        width = util.measureText(ctx, item_data.nickname);
        if (width > 180) {
            ctx.font = Math.floor(180 * 22 / s.width).toString() + "px 微软雅黑"
        }
        ctx.font = "22px 微软雅黑";
        ctx.fillStyle = "white";
        ctx.fillText(item_data.nickname, x + 120 - width * 0.5, 175); //昵称

        let sscore = `${item_data[this.vital_key]}分`;
        width = util.measureText(ctx, sscore);
        ctx.font = "22px 微软雅黑";
        ctx.fillText(sscore, x + 120 - width * 0.5, 205); //分数
    }

    scrollRank(offsety) {
        let ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.cur_offsety += offsety;
        this.cur_offsety = Math.min(Math.max(this.cur_offsety, 0), this.max_offsety);

        let y = this.cur_offsety % (cfg.ITEM_HEIGHT + cfg.GAP);
        let si = ~~(this.cur_offsety / (cfg.ITEM_HEIGHT + cfg.GAP));
        
        for (let i = si, index = 0; i < si + cfg.ITEM_NUM + 2 && i < this.rank_len; i++, index++) {
            this.drawRankItem(index, i, y);
        }
    }

    drawStarFriendRank() {
        this.rank_data = model.star;
        this.rank_len = this.rank_data.length;
        this.vital_key = cfg.VITAL_KEY.STAR;

        let total_h = this.rank_data.length * (cfg.ITEM_HEIGHT + cfg.GAP);
        this.cur_offsety = 0;
        this.max_offsety = Math.max(total_h - cfg.VIEW_HEIGHT, 0);

        this.scrollRank(0);
    }

    drawRussiaFriendRank() {
        this.rank_data = model.russia;
        this.rank_len = this.rank_data.length;
        this.vital_key = cfg.VITAL_KEY.RUSSIA;

        let total_h = this.rank_data.length * (cfg.ITEM_HEIGHT + cfg.GAP);
        this.cur_offsety = 0;
        this.max_offsety = Math.max(total_h - cfg.VIEW_HEIGHT, 0);

        this.scrollRank(0);
    }

    drawUnionFriendRank() {
        this.rank_data = model.union;
        this.rank_len = this.rank_data.length;
        this.vital_key = cfg.VITAL_KEY.UNION;

        let total_h = this.rank_data.length * (cfg.ITEM_HEIGHT + cfg.GAP);
        this.cur_offsety = 0;
        this.max_offsety = Math.max(total_h - cfg.VIEW_HEIGHT, 0);

        this.scrollRank(0);
    }

    drawStarGroupRank() {

    }
    drawRussiaGroupRank() {
        
    }
    drawUnionGroupRank() {
        
    }

    drawSettle() {
        let ctx = this.canvas.getContext('2d');	
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        let me = -1;
        for (let i = 0; i < this.rank_len; i++) {
            if (model.isSelf(this.rank_data[i])) {
                me = i;
            }
        }

        let si = me === 0 ? 0 : me === this.rank_len - 1 ? me - 2 : me - 1;
        si = si < 0 ? 0 : si;
        for (let i = si, index = 0; i < si + 3; i++ , index++) {
            if (i < this.rank_len) {
                this.drawSettleItem(index, i);
            }
        }
    }

    drawStarSettle() {
        this.rank_data = model.star;
        this.rank_len = this.rank_data.length;
        this.vital_key = cfg.VITAL_KEY.STAR;

        this.drawSettle();
    }
    drawRussiaSettle() {
        this.rank_data = model.russia;
        this.rank_len = this.rank_data.length;
        this.vital_key = cfg.VITAL_KEY.RUSSIA;

        this.drawSettle();
    }
    drawUnionSettle() {
        this.rank_data = model.union;
        this.rank_len = this.rank_data.length;
        this.vital_key = cfg.VITAL_KEY.UNION;

        this.drawSettle();
    }
};

export default new View;
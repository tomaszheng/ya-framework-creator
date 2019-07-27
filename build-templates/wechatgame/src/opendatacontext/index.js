
import cfg from "./config.js";
import util from "./util.js";
import model from "./model.js";
import view from "./view.js";

class Controller {

    init() {
        
        util.initLocalImage();

        this.getSelfData();
    }

    test() {
        util.test();
    }

    getSelfData() {
        wx.getUserInfo({
            openIdList: ['selfOpenId'],
            success: (res) => {
                model.updateMyData(res.data);
            },
            fail: (res) => {
                setTimeout(() => {
                    this.getSelfData();
                }, 100);
            }
        });
    }

    controlStar(params) {
        let klist = ["openid", "avatarUrl", "nickname"];
        klist.push(cfg.VITAL_KEY.STAR);
        klist.push(cfg.VITAL_TIME.STAR);
        if (params.action === cfg.AC_F_STAR_FETCH) {
            util.getFriendCloudStorage(klist, (data) => {
                model.updateStarData(data);
                view.drawStarFriendRank();
            });
        }
        else if (params.action === cfg.AC_F_STAR_SETTLE) {
            util.getFriendCloudStorage(klist, (data) => {
                model.updateStarData(data);
                view.drawStarSettle();
            });
        }
        else {
            util.getGroupCloudStorage(klist, params.ticket, (data) => {
                model.updateStarData(data);
                view.drawStarGroupRank();
            });
        }
    }

    controlRussia(params) {
        let klist = ["openid", "avatarUrl", "nickname"];
        klist.push(cfg.VITAL_KEY.RUSSIA);
        klist.push(cfg.VITAL_TIME.RUSSIA);
        if (params.action === cfg.AC_F_RUSSIA_FETCH) {
            util.getFriendCloudStorage(klist, (data) => {
                model.updateRussiaData(data);
                view.drawRussiaFriendRank();
            });
        }
        else if (params.action === cfg.AC_F_RUSSIA_SETTLE) {
            util.getFriendCloudStorage(klist, (data) => {
                model.updateRussiaData(data);
                view.drawRussiaSettle();
            });
        }
        else {
            util.getGroupCloudStorage(klist, params.ticket, (data) => {
                model.updateRussiaData(data);
                view.drawRussiaGroupRank();
            });
        }
    }

    controlHaul(params) {
        let klist = ["openid", "avatarUrl", "nickname", "haul_score", "haul_time"];
        if (params.action === cfg.AC_F_HAUL_FETCH) {
            util.getFriendCloudStorage(klist, (data) => {
                model.updateHaulData(data);
            });
        }
        else {
            util.getGroupCloudStorage(klist, params.ticket, (data) => {
                model.updateHaulData(data);
            });
        }
    }

    controlDigit(params) {
        let klist = ["openid", "avatarUrl", "nickname", "digit_score", "digit_time"];
        if (params.action === cfg.AC_F_DIGIT_FETCH) {
            util.getFriendCloudStorage(klist, (data) => {
                model.updateDigitData(data);
            });
        }
        else {
            util.getGroupCloudStorage(klist, params.ticket, (data) => {
                model.updateDigitData(data);
            });
        }
    }

    controlUnion(params) {
        let klist = ["openid", "avatarUrl", "nickname"];
        klist.push(cfg.VITAL_KEY.UNION);
        klist.push(cfg.VITAL_TIME.UNION);
        if (params.action === cfg.AC_F_UNION_FETCH) {
            util.getFriendCloudStorage(klist, (data) => {
                model.updateUnionData(data);
                view.drawUnionFriendRank();
            });
        }
        else if (params.action === cfg.AC_F_UNION_SETTLE) {
            util.getFriendCloudStorage(klist, (data) => {
                model.updateUnionData(data);
                view.drawUnionSettle();
            });
        }
        else {
            util.getGroupCloudStorage(klist, params.ticket, (data) => {
                model.updateUnionData(data);
                view.drawUnionGroupRank();
            });
        }
    }

    controlPop(params) {
        let klist = ["openid", "avatarUrl", "nickname", "pop_score", "pop_time"];
        if (params.action === cfg.AC_F_POP_FETCH) {
            util.getFriendCloudStorage(klist, (data) => {
                model.updatePopData(data);
            });
        }
        else {
            util.getGroupCloudStorage(klist, params.ticket, (data) => {
                model.updatePopData(data);
            });
        }
    }

    controlScrollV(params) {
        let offsety = params.offsety;
        view.scrollRank(offsety);
    }

    controlScrollH() {

    }

    storage(params) {
        let kvlist = params.kvlist;
        wx.setUserCloudStorage({
            KVDataList: kvlist,
            fail: ()=>{
                setTimeout(()=>{
                    this.storage(params);
                }, 100);
            }
        });
    }
};

let controller = new Controller();

wx.onMessage((params)=>{
    let action = params.action;
    if (action === cfg.AC_INIT) {
        controller.init();
    }
    else if (action === cfg.AC_TEST) {
        controller.test();
    }
    else if (action === cfg.AC_STORAGE) {
        controller.storage(params);
    }
    else if (action === cfg.AC_SCROLL_V) {
        controller.controlScrollV(params);
    }
    else if (action === cfg.AC_SCROLL_H) {
        controller.controlScrollH(params);
    }
    else if (action === cfg.AC_F_STAR_FETCH || 
        action === cfg.AC_G_STAR_FETCH || 
        action === cfg.AC_F_STAR_SETTLE) {
        controller.controlStar(params);
    }
    else if (action === cfg.AC_F_RUSSIA_FETCH || 
        action === cfg.AC_G_RUSSIA_FETCH || 
        action === cfg.AC_F_RUSSIA_SETTLE) {
        controller.controlRussia(params);
    }
    else if (action === cfg.AC_F_HAUL_FETCH || action === cfg.AC_G_HAUL_FETCH) {
        controller.controlHaul(params);
    }
    else if (action === cfg.AC_F_DIGIT_FETCH || action === cfg.AC_G_DIGIT_FETCH) {
        controller.controlDigit(params);
    }
    else if (action === cfg.AC_F_UNION_FETCH || 
        action === cfg.AC_G_UNION_FETCH ||
        action === cfg.AC_F_UNION_SETTLE) {
        controller.controlUnion(params);
    }
    else if (action === cfg.AC_F_POP_FETCH || action === cfg.AC_G_POP_FETCH) {
        controller.controlPop(params);
    }
});
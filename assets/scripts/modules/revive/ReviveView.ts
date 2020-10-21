import {GameConstant} from "../../config/GameConstant";
import {GameText} from "../../config/GameText";
import {BaseDialog} from "../../framework/mvc/BaseDialog";
import {utils} from "../../framework/utils/Utils";
import {soundManager} from "../../framework/manager/SoundManager";

const {ccclass, property} = cc._decorator;

@ccclass
class ReviveView extends BaseDialog {
    @property(cc.Label) lblTip: cc.Label = null;
    @property(cc.Label) lblReviveTxt: cc.Label = null;

    mode = -1;
    score = -1;
    reviveNum = -1;
    totalNum = -1;
    successCb: ()=>void = null;
    failCb: ()=>void = null;

    protected initData(data?: any) {
        super.initData(data);

        this.mode = data.mode;
        this.score = data.score;
        this.reviveNum = data.revive_num;
        this.totalNum = data.total_num;
        this.successCb = data.success_cb;
        this.failCb = data.fail_cb;
    }

    protected initUI() {
        super.initUI();

        soundManager.playEffect("Sound/die");

        const str = cc.js.formatStr(GameText.str_004, this.reviveNum, this.totalNum);
        this.lblTip.string = str;

        if (this.mode === GameConstant.REVIVE_MODE.FREE) {
            this.lblReviveTxt.string = GameText.str_001;
        }
        else if (this.mode === GameConstant.REVIVE_MODE.SHARE) {
            this.lblReviveTxt.string = GameText.str_002;
        }
        else if (this.mode === GameConstant.REVIVE_MODE.VIDEO) {
            this.lblReviveTxt.string = GameText.str_003;
        }
    }

    onClickClose () {
        utils.doCallback(this.failCb);

        this.removeSelf();
    }

    onClickSpace () {
        // this.onClickClose();
    }

    onClickRevive () {
        if (this.mode === GameConstant.REVIVE_MODE.FREE) {
            this.reviveSuccess();
        }
        else if (this.mode === GameConstant.REVIVE_MODE.SHARE) {
            // ya.platform.share({
            //     title: cc.js.formatStr(GameText.share_title_revive, this.score),
            //     imageUrl: ya.res.image_share_revive,
            //     cb: (code, res)=>{
            //         if (code === 0) {
            //             this.reviveSuccess();
            //         }
            //     }
            // });
        }
        else if (this.mode === GameConstant.REVIVE_MODE.VIDEO) {
            // ya.platform.showVideoAd((is_ended)=>{
            //     if (is_ended) {
            //         this.reviveSuccess();
            //     }
            // });
        }
    }

    reviveSuccess () {
        utils.doCallback(this.successCb);

        this.removeSelf();
    }
}

export {ReviveView};

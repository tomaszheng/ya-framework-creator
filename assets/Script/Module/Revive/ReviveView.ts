import ya from "../../Framework/ya";
import GameText from "../../Config/GameText";
import GameConstant from "../../Config/GameConstant";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ReviveView extends ya.Dialog {
    @property(cc.Label)
    lbl_tip: cc.Label = null;

    @property(cc.Label)
    lbl_revive_txt: cc.Label = null;

    mode: number = -1;
    score: number = -1;
    revive_num: number = -1;
    total_num: number = -1;
    success_cb: Function = null;
    fail_cb: Function = null;

    onInitData (data: any) {
        this.mode = data.mode;
        this.score = data.score;
        this.revive_num = data.revive_num;
        this.total_num = data.total_num;
        this.success_cb = data.success_cb;
        this.fail_cb = data.fail_cb;
    }

    onInitUI () {
        ya.soundManager.playEffect("Sound/die");

        let str = cc.js.formatStr(GameText.str_004, this.revive_num, this.total_num);
        this.lbl_tip.string = str;

        if (this.mode === GameConstant.REVIVE_MODE.FREE) {
            this.lbl_revive_txt.string = GameText.str_001;
        }
        else if (this.mode === GameConstant.REVIVE_MODE.SHARE) {
            this.lbl_revive_txt.string = GameText.str_002;
        }
        else if (this.mode === GameConstant.REVIVE_MODE.VIDEO) {
            this.lbl_revive_txt.string = GameText.str_003;
        }
    }

    onClickClose () {
        this.fail_cb && this.fail_cb();

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
        this.success_cb && this.success_cb();

        this.removeSelf();
    }
}

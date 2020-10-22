import {BaseDialog} from "../../../framework/mvc/dialog/BaseDialog";
import {buttonHelper} from "../../../framework/utils/ButtonHelper";
import {utils} from "../../../framework/utils/Utils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ArchiveView extends BaseDialog {
    @property(cc.Node) btnClose: cc.Node = null;
    @property(cc.Node) btnContinue: cc.Node = null;
    @property(cc.Node) btnRestart: cc.Node = null;

    continueCallback: () => void = null;
    restartCallback: () => void = null;

    protected initData(data?: any) {
        super.initData(data);

        this.continueCallback = data.continue_cb;
        this.restartCallback = data.restart_cb;
    }

    protected initTouchEvent() {
        super.initTouchEvent();

        buttonHelper.addClick(this.btnClose, () => {
            this.onClickClose();
        }, this);
        buttonHelper.addClick(this.btnContinue, () => {
            this.onClickContinue();
        }, this);
        buttonHelper.addClick(this.btnRestart, () => {
            this.onClickRestart();
        }, this);
    }

    onClickClose() {
        this.removeSelf();
    }

    onClickContinue() {
        this.removeSelf();

        utils.doCallback(this.continueCallback);
    }

    onClickRestart() {
        this.removeSelf();

        utils.doCallback(this.restartCallback);
    }
}

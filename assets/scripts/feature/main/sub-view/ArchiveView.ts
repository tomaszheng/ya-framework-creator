import {ya} from "../../../framework/ya";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ArchiveView extends ya.Dialog {
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

        ya.button.addClick(this.btnClose, () => {
            this.onClickClose();
        });
        ya.button.addClick(this.btnContinue, () => {
            this.onClickContinue();
        });
        ya.button.addClick(this.btnRestart, () => {
            this.onClickRestart();
        });
    }

    onClickClose() {
        this.removeSelf();
    }

    onClickContinue() {
        this.removeSelf();

        ya.utils.doCallback(this.continueCallback);
    }

    onClickRestart() {
        this.removeSelf();

        ya.utils.doCallback(this.restartCallback);
    }
}
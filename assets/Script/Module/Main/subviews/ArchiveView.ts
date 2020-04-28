import ya from "../../../Framework/ya";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ArchiveView extends ya.Dialog {
    @property(cc.Node)
    btn_close: cc.Node = null;

    @property(cc.Node)
    btn_continue: cc.Node = null;

    @property(cc.Node)
    btn_restart: cc.Node = null;

    continue_cb: Function|null = null;
    restart_cb: Function|null = null;

    onInitData (data: any) {
        this.continue_cb = data.continue_cb;
        this.restart_cb = data.restart_cb;
    }

    onInitClick () {
        ya.utils.addClickEvent(this.btn_close, () => {
            this.onClickClose();
        });
        ya.utils.addClickEvent(this.btn_continue, () => {
            this.onClickContinue();
        });
        ya.utils.addClickEvent(this.btn_restart, () => {
            this.onClickRestart();
        });
    }

    onClickClose() {
        this.removeSelf();
    }

    onClickContinue() {
        this.removeSelf();

        ya.utils.doCallback(this.continue_cb);
    }

    onClickRestart() {
        this.removeSelf();

        ya.utils.doCallback(this.restart_cb);
    }
}
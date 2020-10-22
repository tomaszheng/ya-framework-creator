import {utils} from "../../utils/Utils";

class DialogTransition extends cc.Component {
    protected enterCompletedCallback: VoidCallback = null;
    protected exitCompletedCallback: VoidCallback = null;
    protected enterAction: cc.Tween = null;
    protected exitAction: cc.Tween = null;

    public init(enterComplete: VoidCallback, exitComplete: VoidCallback) {
        this.enterCompletedCallback = enterComplete;
        this.exitCompletedCallback = exitComplete;
    }

    public runEnter() {
        this.doEnterCompleted();
    }

    public runExit() {
        this.doExitCompleted();
    }

    protected doEnterCompleted() {
        this.enterAction = null;
        utils.doCallback(this.enterCompletedCallback);
    }

    protected doExitCompleted() {
        this.exitAction = null;
        utils.doCallback(this.exitCompletedCallback);
    }

    public stop() {
        this.stopEnter();
        this.stopExit();
    }

    private stopEnter() {
        if (this.enterAction) {
            this.enterAction.stop();
            this.enterAction = null;
        }
    }

    private stopExit() {
        if (this.exitAction) {
            this.exitAction.stop();
            this.exitAction = null;
        }
    }
}

class DialogScaleTransition extends DialogTransition {
    public runEnterAnimation() {
        this.node.scale = 0.6;
        this.node.anchorX = this.node.anchorY = 0.5;

        this.enterAction = cc.tween(this.node)
            .to(0.2, {scale: 1.08}, {easing: "sineOut"})
            .to(0.2, {scale: 1.00}, {easing: "sineOut"})
            .delay(0.0)
            .call(() => {
                this.doEnterCompleted();
            });
    }

    public runExitAnimation() {
        this.exitAction = cc.tween(this.node)
            .parallel(
                cc.tween().to(0.1, {scale: 0.8}),
                cc.tween().to(0.1, {opacity: 130})
            )
            .call(() => {
                this.doExitCompleted();
            });
    }
}

export {DialogTransition, DialogScaleTransition};

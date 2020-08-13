import {Singleton} from "../singleton/Singleton";

class YaLayerManager extends Singleton<YaLayerManager> {
    public get view(): cc.Node {
        return this._view;
    }

    public get dialog(): cc.Node {
        return this._dialog;
    }

    public get top(): cc.Node {
        return this._top;
    }

    private _view: cc.Node = null;
    private _dialog: cc.Node = null;
    private _top: cc.Node = null;

    private static addFullScreenWidget(node) {
        const widget: cc.Widget = node.addComponent(cc.Widget);
        widget.alignMode = cc.Widget.AlignMode.ON_WINDOW_RESIZE;
        widget.top = widget.bottom = widget.left = widget.right = 0;
    }

    public init(): void {
        const canvas = cc.find('Canvas');

        this._view = new cc.Node('view');
        this._view.parent = canvas;
        this._view.zIndex = 1;

        this._dialog = new cc.Node('dialog');
        this._dialog.parent = canvas;
        this._dialog.zIndex = 2;

        this._top = new cc.Node('top');
        this._top.parent = canvas;
        this._top.zIndex = 3;

        YaLayerManager.addFullScreenWidget(this._view);
        YaLayerManager.addFullScreenWidget(this._dialog);
        YaLayerManager.addFullScreenWidget(this._top);
    }
}

const yaLayerManager = YaLayerManager.instance(YaLayerManager);
export {yaLayerManager};

import {Singleton} from "../singleton/Singleton";

class LayerManager extends Singleton<LayerManager> {
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

        LayerManager.addFullScreenWidget(this._view);
        LayerManager.addFullScreenWidget(this._dialog);
        LayerManager.addFullScreenWidget(this._top);
    }
}

const layerManager = LayerManager.instance(LayerManager);
export {layerManager};

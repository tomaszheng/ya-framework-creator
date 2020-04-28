
export default class YALayerManager {
    
    private static _instance: YALayerManager = null;
    static getInstance(): YALayerManager {
        if (!this._instance) {
            this._instance = new YALayerManager();
        }
        return this._instance;
    }

    _layerView: cc.Node = null;
    set view(v: cc.Node) {
        this._layerView = v;
    }
    get view() {
        return this._layerView;
    }

    _layerDialog:cc.Node = null;
    set dialog(v: cc.Node) {
        this._layerDialog = v;
    }
    get dialog() {
        return this._layerDialog;
    }

    _layerTop:cc.Node = null;
    set top(v: cc.Node) {
        this._layerTop = v;
    }
    get top() {
        return this._layerTop;
    }

}
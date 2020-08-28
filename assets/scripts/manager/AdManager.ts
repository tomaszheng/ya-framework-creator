import {BaseAd} from "../platform/BaseAd";
import {WxAd} from "../platform/wx/WxAd";

class PlatformManager {
    private static _instance: BaseAd = null;
    public static get instance() {
        if (!this._instance) {
            if (cc.sys.platform === cc.sys.WECHAT_GAME) {
                this._instance = new WxAd();
            } else {
                this._instance = new BaseAd();
            }
        }
        return this._instance;
    }
}

const platformManager = PlatformManager.instance;
export {platformManager};

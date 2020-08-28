import {BasePlatform} from "../platform/BasePlatform";
import {WxPlatform} from "../platform/wx/WxPlatform";
import {BaseAd} from "../platform/BaseAd";
import {WxAd} from "../platform/wx/WxAd";
import {ya} from "../framework/ya";

class PlatformManager extends ya.Singleton<PlatformManager> {
    private _platform: BasePlatform = null;
    private _ad: BaseAd = null;

    public get platform() {
        return this._platform;
    }

    public get ad() {
        return this._ad;
    }

    public init() {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            this._platform = new WxPlatform();
            this._ad = new WxAd();
        } else {
            this._platform = new BasePlatform();
            this._ad = new BaseAd();
        }
    }
}

export {PlatformManager};

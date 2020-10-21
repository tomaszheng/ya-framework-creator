import {BasePlatform} from "../platform/BasePlatform";
import {WxPlatform} from "../platform/wx/WxPlatform";
import {BaseAd} from "../platform/BaseAd";
import {WxAd} from "../platform/wx/WxAd";
import {Singleton} from "../framework/singleton/Singleton";

class PlatformManager extends Singleton<PlatformManager> {
    public get platform() {
        return this._platform;
    }

    public get ad() {
        return this._ad;
    }

    private _ad: BaseAd = null;
    private _platform: BasePlatform = null;

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

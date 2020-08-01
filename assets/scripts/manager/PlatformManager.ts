import BasicPlatform from "../platform/BasicPlatform";
import {WeChatPlatform} from "../platform/WeChatPlatform";

class PlatformManager {
    private static _instance: BasicPlatform = null;
    public static get instance() {
        if (!this._instance) {
            if (cc.sys.platform === cc.sys.WECHAT_GAME) {
                this._instance = new WeChatPlatform();
            }
            else {
                this._instance = new BasicPlatform();
            }
        }
        return this._instance;
    }
}

export { PlatformManager }
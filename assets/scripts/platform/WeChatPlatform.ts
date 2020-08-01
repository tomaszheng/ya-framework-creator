/*
微信小游戏平台接口类
*/

import BasicPlatform from "./BasicPlatform";
import {GameConstant} from "../config/GameConstant";
import {EventConfig} from "../config/EventConfig";
import {GameText} from "../config/GameText";
import ya from "../framework/ya";

const {ccclass, property} = cc._decorator;

@ccclass
class WeChatPlatform extends BasicPlatform {
    systemInfo:any = null;
    btnUserInfo:any = null;
    btnGameClub:any = null;

    launchData:any = null;

    private _isAuthorized:boolean = false;   // 用户是否授权
    get isAuthorized() {
        return this._isAuthorized;
    }
    set isAuthorized(authorized:boolean) {
        this._isAuthorized = authorized;
    }

    videoIds:any = {};
    videoHandlers:any = {};
    videoCloses:any = {};
    videoLoaded:any = {};   // 视频广告是否加载成功

    loc_login_data: any = {};

    bannerHandler:any = null;
    shareCallback:Function = null;

    onShow() {
        //切前台后延长0.2s把分享回调置空
        let greater230 = (this.getSystemInfoSync().SDKVersion || "0") >= "2.3.0";
        if (greater230) {
            setTimeout(()=>{
                this.shareCallback = null;
            }, 200);
        }
    }

    onError() {
        window['wx'].onError((res) => {

        });
    }

    report(params) {
        if (typeof params !== "object") return;

        let data_list = [];
        for (let key in params) {
            data_list.push({ key: key, value: params[key].toString() });
        }

        let context = window['wx'].getOpenDataContext();
        context.postMessage({ action: GameConstant.WX.AC_STORAGE, kvlist: data_list });
    }

    authorize(scope, cb) {
        if (!window['wx'].authorize) return;

        !cb && (cb = scope, scope = "scope.userInfo");

        window['wx'].authorize({
            scope: scope,
            success: () => {
                if (scope === "scope.userInfo") {
                    this.isAuthorized = true;
                }
                cb && cb(0);
            },
            fail: (res) => {
                cb && cb(-1);
            }
        });
    }

    _callSetting(code, settings?: any, scope?: string, cb?: Function) {
        let callback = (code) => {
            cb && (cb(code), cb = null);
        };

        if (code === -1) {
            callback(-1);
        }
        else {
            settings = settings || {};

            if (settings["scope.userInfo"]) {
                this.isAuthorized = true;
            }

            if (settings[scope]) {
                callback(0);
            }
            else {
                callback(-1);
            }
        }
    }

    getSetting(callback, scope) {
        !scope && (scope = "scope.userInfo");

        if (!window['wx'].getSetting) {
            callback(-1);
            return;
        }

        window['wx'].getSetting({
            success: (res) => {
                this._callSetting(0, res.authSetting, scope, callback);
            },
            fail: () => {
                this._callSetting(-1);
            }
        });
    }

    openSetting(cb, scope) {
        !scope && (scope = "scope.userInfo");

        if (!window['wx'].openSetting) return;

        window['wx'].openSetting({
            success: (res) => {
                this._callSetting(0, res.authSetting, scope, cb);
            },
            fail: () => {
                this._callSetting(-1);
            }
        });
    }

    getUserInfo(cb) {
        if (!window['wx'].getUserInfo) {
            cb && cb(-1);
            return;
        }

        window['wx'].getUserInfo({
            withCredentials: true,
            success: (res) => {
                cb && cb(0, res);
            },
            fail: () => {
                cb && cb(-1);
            }
        });
    }

    login(cb:Function) {
        if (!window['wx'].login) return;

        window['wx'].login({
            success: (res) => {
                this.loc_login_data = this.loc_login_data || {};
                this.loc_login_data.code = res.code;
                this.getSetting((ret) => {
                    if (ret === 0) {
                        // this.getUserInfoWithOutButton(cb);
                    } else {
                        if (cb) cb(0);
                    }
                }, "scope.userInfo")
            },
            fail: () => {
                if (cb) cb(0);
            }
        });
    }

    checkSession(cb) {
        if (!window['wx'].checkSession) return;

        window['wx'].checkSession({
            success: () => {
                cb && cb(0);
            },
            fail: () => {
                cb && cb(-1);
            }
        });
    }

    getSystemInfoSync() {
        if (!this.systemInfo) {
            this.systemInfo = window['wx'].getSystemInfoSync();
        }
        return this.systemInfo;
    }

    //获取平台类别，默认ios
    getPlatformName() {
        let systemInfo = this.getSystemInfoSync();
        return systemInfo.platform || "ios";
    }

    createUserInfoButton(cb):boolean {
        let systemInfo = this.getSystemInfoSync();
        let version = systemInfo.version;

        if (!window['wx'].createUserInfoButton || version === "6.6.6") return false;

        if (this.btnUserInfo) {
            this.btnUserInfo.destroy();
            this.btnUserInfo = null;
        }

        this.btnUserInfo = window['wx'].createUserInfoButton({
            type: "image",
            image: "images/img_pure.png",
            style: {
                top: 0,
                left: 0,
                width: systemInfo.screenWidth,
                height: systemInfo.screenHeight,
            }
        });

        this.btnUserInfo.onTap((res) => {
            this.btnUserInfo.destroy();
            this.btnUserInfo = null;
            if (res && res.userInfo) {
                this.isAuthorized = true;
            }
            cb && cb(res);
        });

        return true;
    }

    saveImageToPhotosAlbum(filePath, cb) {
        if (window['wx'].saveImageToPhotosAlbum) {
            window['wx'].saveImageToPhotosAlbum({
                filePath: filePath,
                success: () => {
                    cb && cb(0);
                },
                fail: () => {
                    cb && cb(-1);
                }
            });
        }
        else {
            cb && cb(-1);
        }
    }

    /*
    appid: 要打开的小程序appid
    data: 要传递的数据
    completeCb: 调用接口后的回调
    */
    navigateToProgram(appid, data, cb) {
        if (window['wx'].navigateToMiniProgram) {
            window['wx'].navigateToMiniProgram({
                appId: appid,
                path: data.path,
                extraData: data.extra,
                envVersion: data.env,
                success: () => {
                    cb && cb(0);
                },
                fail: () => {
                    cb && cb(-1);
                }
            });
        }
        else {
            cb && cb(-1);
        }
    }

    //预览图片
    previewImage(urls, cb) {
        if (!urls || urls.length < 1 || !window['wx'].previewImage) return;

        window['wx'].previewImage({
            urls: urls,
            success: () => {
                cb && cb(0);
            },
            fail: () => {
                cb && cb(-1);
            }
        });
    }

    isSupportAd() {
        // let system_info = this.getSystemInfoSync();
        // return system_info.SDKVersion >= "2.0.4";
        return false;
    }

    createVideoAd(name?: string) {
        if (!this.isSupportAd()) return;

        let adid = this.videoIds[name];
        let handler = this.videoHandlers[name];
        if (!handler) {
            handler = window['wx'].createRewardedVideoAd({
                adUnitId: adid
            });

            handler.onError((err) => {
                setTimeout(() => {
                    this.loadVideoAd(name);
                }, 500);
                if (err.errCode) {
                    ya.eventDispatcher.emit(EventConfig.SHOW_TOAST, { txt: cc.js.formatStr(GameText.ad_err_tips, err.errCode.toString()) });
                }
            });

            handler.onLoad(()=>{
                this.videoLoaded[name] = true;
            });

            // 用户点击了[关闭广告]按钮
            handler.onClose((res) => {
                // 小于 2.1.0 的基础库版本，res 是一个 undefined
                let is_ended = (res && res.isEnded) || (res === undefined) || false;
                this.videoCloses[name] && this.videoCloses[name](is_ended);

                this.loadVideoAd(name);
            });
            this.videoHandlers[name] = handler;

            this.loadVideoAd(name);
        }
    }

    loadVideoAd(name) {
        this.videoLoaded[name] = false;
        this.videoHandlers[name].load();
    }

    showVideoAd(cb, name: string) {
        let handler = this.videoHandlers[name];
        if (handler) {
            this.videoCloses[name] = cb;
            if (this.videoLoaded[name]) {
                handler.load();
                handler.show();
            }
            else {
                handler.show();
            }
        }
    }

    showBannerAd() {
        if (!this.isSupportAd()) return;

        this.destoryBannerAd();

        let frame_size = cc.view.getFrameSize();
        this.bannerHandler = window['wx'].createBannerAd({
            adUnitId: 'adunit-bc4c247f8cbd5fce',
            style: {
                left: 0,
                top: frame_size.height,
                width: 315,
            }
        });

        this.bannerHandler.onResize((res)=>{
            this.bannerHandler.style.top = frame_size.height - res.height;
            this.bannerHandler.style.left = (frame_size.width - res.width) * 0.5;
        });

        this.bannerHandler.show();

        return this.bannerHandler
    }

    destoryBannerAd() {
        if (this.bannerHandler) {
            this.bannerHandler.offError();
            this.bannerHandler.offResize();
            this.bannerHandler.destory();
            this.bannerHandler = null;
        }
    }

    createGameClubButton(params) {
        if (!this.isSupportGameClub()) return;

        if (!this.btnGameClub) {
            this.btnGameClub = window['wx'].createGameClubButton({
                type: "image",
                icon: "white",
                image: "images/img_pure.png",
                style: {
                    top: params.top,
                    left: params.left,
                    width: params.width,
                    height: params.height,
                }
            });
            this.btnGameClub.image = "images/img_pure.png";
        }
        else {
            let style = this.btnGameClub.style;
            style.top = params.top;
            style.left = params.left;
            style.width = params.width;
            style.height = params.height;
        }

        this.btnGameClub.show();
        
        return this.btnGameClub;
    }

    destoryGameClubButton() {
        if (this.btnGameClub) {
            this.btnGameClub.hide();
        }
    }

    isSupportGameClub() {
        let system_info = this.getSystemInfoSync();
        return system_info.SDKVersion >= "2.0.3";
    }

    openCustomerService() {
        if (!this.isSupportCustomerService()) return;

        window['wx'].openCustomerServiceConversation({
            showMessageCard: false,
        });
    }

    isSupportCustomerService() {
        let system_info = this.getSystemInfoSync();
        return system_info.SDKVersion >= "2.0.3";
    }

    setClipboardData(content) {
        !content && (content = "");

        window['wx'].setClipboardData({
            data: String(content)
        });
    }

    listen() {
        super.listen();

        //菜单栏转发
        window['wx'].showShareMenu({
            withShareTicket: true
        });

        window['wx'].onShareAppMessage(() => {
            return {
                title: GameText.share_title_common,
                imageUrl: GameText.share_common_img,
            };
        });

        if (window['wx'] && window['wx'].getOpenDataContext) {
            window['wx'].getOpenDataContext().postMessage({ action: GameConstant.WX.AC_INIT });
        }
    }

    exit() {
        window['wx'].exitMiniProgram();
    }

    hideKeyboard(scb, fcb, ccb) {
        if (window['wx'].hideKeyboard) {
            window['wx'].hideKeyboard({
                success: () => {
                    scb && scb();
                },
                fail: () => {
                    fcb && fcb();
                },
                complete: () => {
                    ccb && ccb();
                }
            });
        }
        if (window['wx'].offKeyboardConfirm) {
            window['wx'].offKeyboardConfirm();
        }
        if (window['wx'].offKeyboardInput) {
            window['wx'].offKeyboardInput();
        }
        if (window['wx'].offKeyboardComplete) {
            window['wx'].offKeyboardComplete();
        }
    }

    garbageCollect() {
        window['wx'].triggerGC();
    }

    keepScreenOn() {
        window['wx'].setKeepScreenOn({
            keepScreenOn: true
        });
    }

    share(params) {
        !params && (params = {});

        this.shareCallback = params.cb;

        let greater230 = (this.getSystemInfoSync().SDKVersion || "0") >= "2.3.0";

        let query = params.query || "";
        let title = params.title || GameText.share_title_common;
        let imageUrl = params.imageUrl || "images/common_share_img.jpg";

        window['wx'].shareAppMessage({
            title: title,
            imageUrl: imageUrl,
            query: query, //透传参数"key1=1&key2=2"格式

            success: (res) => {
                //基础库版本小于2.3.0有回调
                if (!greater230) {
                    this.shareCallback && (this.shareCallback(0, res), this.shareCallback = null);
                }
            },
            fail: () => {
                //基础库版本小于2.3.0有回调
                if (!greater230) {
                    this.shareCallback && (this.shareCallback(-1), this.shareCallback = null);
                }
            },
        });

        //3s之后自动调用
        setTimeout(() => {
            if (greater230) {
                this.shareCallback && (this.shareCallback(0, {}), this.shareCallback = null);
            }
        }, 3200);
    }
}

export { WeChatPlatform }
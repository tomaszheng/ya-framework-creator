/*
微信小游戏平台接口类
*/

import {GameConstant} from "../../config/GameConstant";
import {GameText} from "../../config/GameText";
import {BasePlatform} from "../BasePlatform";

class WxPlatform extends BasePlatform {
    systemInfo: wx.systemInfo = null;
    btnUserInfo: wx.UserInfoButton = null;
    btnGameClub: wx.GameClubButton = null;

    public get isAuthorized() {
        return this._isAuthorized;
    }

    private _isAuthorized = false;
    private loginCode = '';
    private timeOnHide = -1;
    private shareCallback: ResultCallback = null;

    protected onShow() {
        this.checkShareResult();
    }

    protected onHide() {
        this.timeOnHide = new Date().getTime();
    }

    public onError() {
        wx.onError((res) => {

        });
    }

    public report(data: {key: string, value: string}[]) {
        const context = wx.getOpenDataContext();
        context.postMessage({action: GameConstant.WX.AC_STORAGE, kvlist: data});
    }

    public authorize(cb: ResultCallback, scope?: string) {
        scope = scope || 'scope.userInfo';

        wx.authorize({
            scope,
            success: () => {
                if (scope === "scope.userInfo") {
                    this._isAuthorized = true;
                }
                if (cb) cb(0);
            },
            fail: (res) => {
                if (cb) cb(-1, res);
            }
        });
    }

    public getUserInfo(cb: ResultCallback) {
        wx.getUserInfo({
            withCredentials: true,
            success: (res) => {
                if (cb) cb(0, res);
            },
            fail: () => {
                if (cb) cb(-1);
            }
        });
    }

    public login(cb: ResultCallback) {
        wx.login({
            success: (res) => {
                this.loginCode = res.code;
            },
            fail: () => {
                if (cb) cb(-1);
            }
        });
    }

    public checkSession(cb: ResultCallback) {
        wx.checkSession({
            success: () => {
                if (cb) cb(0);
            },
            fail: () => {
                if (cb) cb(-1);
            }
        });
    }

    private callSetting(code: number, settings: wx.AuthSetting, scope: string, cb: ResultCallback) {
        if (code === -1) {
            if (cb) cb(-1);
        } else {
            if (settings["scope.userInfo"]) {
                this._isAuthorized = true;
            }
            if (cb) cb(settings[scope] ? 0 : -1);
        }
    }

    public getSetting(scope: string, cb?: ResultCallback) {
        wx.getSetting({
            success: (res) => {
                this.callSetting(0, res.authSetting, scope, cb);
            },
            fail: () => {
                this.callSetting(-1, null, scope, cb);
            }
        });
    }

    public openSetting(scope?: string, cb?: ResultCallback) {
        scope = scope || "scope.userInfo";
        wx.openSetting({
            success: (res) => {
                this.callSetting(0, res.authSetting, scope, cb);
            },
            fail: () => {
                this.callSetting(-1, null, scope, cb);
            }
        });
    }

    public getSystemInfoSync() {
        if (!this.systemInfo) {
            this.systemInfo = wx.getSystemInfoSync();
        }
        return this.systemInfo;
    }

    public getPlatformName() {
        const systemInfo = this.getSystemInfoSync();
        return systemInfo.platform || "ios";
    }

    public createUserInfoButton(cb: ResultCallback) {
        const systemInfo = this.getSystemInfoSync();

        if (this.btnUserInfo) {
            this.btnUserInfo.destroy();
            this.btnUserInfo = null;
        }

        this.btnUserInfo = wx.createUserInfoButton({
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
                this._isAuthorized = true;
            }
            cb(0, res);
        });
    }

    public saveImageToPhotosAlbum(filePath: string, cb?: ResultCallback) {
        wx.saveImageToPhotosAlbum({
            filePath,
            success: () => {
                if (cb) cb(0);
            },
            fail: () => {
                if (cb) cb(-1);
            }
        });
    }

    /**
     * 打开指定的小程序
     * @param appId 要打开的小程序appId
     * @param data 传递的数据
     * @param cb 调用接口后的回调
     */
    public navigateToProgram(appId: string, data: { path?: string, extraData?: string, envVersion?: string }, cb?: ResultCallback) {
        wx.navigateToMiniProgram({
            appId,
            path: data.path,
            extraData: data.extraData,
            envVersion: data.envVersion,
            success: () => {
                if (cb) cb(0);
            },
            fail: () => {
                if (cb) cb(-1);
            }
        });
    }

    public previewImage(urls: string[], cb?: (code: number) => void) {
        if (!urls || urls.length < 1) return;

        wx.previewImage({
            urls,
            success: () => {
                if (cb) cb(0);
            },
            fail: () => {
                if (cb) cb(-1);
            }
        });
    }

    public createGameClubButton(params: any) {
        if (!this.btnGameClub) {
            this.btnGameClub = wx.createGameClubButton({
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
        } else {
            const style = this.btnGameClub.style;
            style.top = params.top;
            style.left = params.left;
            style.width = params.width;
            style.height = params.height;
        }
        this.btnGameClub.show();

        return this.btnGameClub;
    }

    public destroyGameClubButton() {
        if (this.btnGameClub) {
            this.btnGameClub.hide();
        }
    }

    public openCustomerService() {
        wx.openCustomerServiceConversation({
            showMessageCard: false,
        });
    }

    public setClipboardData(data: string) {
        wx.setClipboardData({
            data
        });
    }

    protected listen() {
        super.listen();

        wx.showShareMenu({
            withShareTicket: true
        });

        wx.onShareAppMessage(() => {
            return {
                title: GameText.share_title_common,
                imageUrl: GameText.share_common_img,
            };
        });
    }

    public exit() {
        wx.exitMiniProgram({});
    }

    public hideKeyboard(cb: ResultCallback) {
        wx.hideKeyboard({
            success: () => {
                if (cb) cb(0);
            },
            fail: () => {
                if (cb) cb(-1);
            },
            complete: () => {
                if (cb) cb(1);
            }
        });
    }

    public garbageCollect() {
        wx.triggerGC();
    }

    public keepScreenOn() {
        wx.setKeepScreenOn({
            keepScreenOn: true
        });
    }

    public share(title: string, imageUrl: string, query: string, cb: ResultCallback) {
        this.shareCallback = cb;

        wx.shareAppMessage({
            title,
            imageUrl,
            query,
        });
    }

    private checkShareResult() {
        if (!this.shareCallback) return;

        setTimeout(() => {
            const curTime = new Date().getTime();
            if (this.timeOnHide + 3000 < curTime) {
                this.shareCallback(0);
            } else {
                this.shareCallback(-1);
            }
            this.shareCallback = null;
        }, 2000);
    }
}

export {WxPlatform};

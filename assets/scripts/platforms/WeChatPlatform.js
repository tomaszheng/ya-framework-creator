/*
微信小游戏平台接口类
*/

let BasicPlatform = require("./BasicPlatform");

cc.Class({
    extends: BasicPlatform,

    properties: {
        system_info: null,
        btn_userinfo: null,
        btn_game_club: null,

        launch_data: null,

        //用户是否授权
        is_authorized: false,

        video_ids: { default: {} },
        video_handlers: { default: {} },
        video_closes: { default: {} },
        video_loadded: { default: {} }, //视频广告是否加载成功

        banner_handler: null,

        share_cb: null, //分享的回调
    },

    ctor() {
    },

    onShow() {
        //切前台后延长0.2s把分享回调置空
        let greater230 = (this.getSystemInfoSync().SDKVersion || "0") >= "2.3.0";
        if (greater230) {
            setTimeout(()=>{
                this.share_cb = null;
            }, 200);
        }
    },
    onError() {
        wx.onError((res) => {

        });
    },

    report(params) {
        if (typeof params !== "object") return;

        let data_list = [];
        for (let key in params) {
            data_list.push({ key: key, value: params[key].toString() });
        }

        let context = wx.getOpenDataContext();
        context.postMessage({ action: ya.const.WX.AC_STORAGE, kvlist: data_list });
    },

    authorize(scope, cb) {
        if (!wx.authorize) return;

        !cb && (cb = scope, scope = "scope.userInfo");
        
        wx.authorize({
            scope: scope,
            success: () => {
                if (scope === "scope.userInfo") {
                    this.is_authorized = true;
                }
                cb && cb(0);
            },
            fail: (res) => {
                cb && cb(-1);
            }
        });
    },

    //判断用户是否授权
    isAuthorized() {
        return this.is_authorized = true;
    },

    _callSetting(code, settings, scope, cb) {
        let callback = (code) => {
            cb && (cb(code), cb = null);
        };

        if (code === -1) {
            callback(-1);
        }
        else {
            settings = settings || {};

            if (settings["scope.userInfo"]) {
                this.is_authorized = true;
            }

            if (settings[scope]) {
                callback(0);
            }
            else {
                callback(-1);
            }
        }
    },

    getSetting(scope, cb) {
        !cb && (cb = scope, scope = "scope.userInfo");

        if (!wx.getSetting) {
            callback(-1);
            return;
        }

        wx.getSetting({
            success: (res) => {
                this._callSetting(0, res.authSetting, scope, cb);
            },
            fail: () => {
                this._callSetting(-1);
            }
        });
    },

    openSetting(scope, cb) {
        !cb && (cb = scope, scope = "scope.userInfo");

        if (!wx.openSetting) return;
        
        wx.openSetting({
            success: (res) => {
                this._callSetting(0, res.authSetting, scope, cb);
            },
            fail: () => {
                this._callSetting(-1);
            }
        });
    },

    getUserInfo(cb) {
        if (!wx.getUserInfo) {
            cb && cb(-1);
            return;
        }

        wx.getUserInfo({
            withCredentials: true,
            success: (res) => {
                cb && cb(0, res);
            },
            fail: () => {
                cb && cb(-1);
            }
        });
    },

    login(cb) {
        if (!wx.login) return;
        
        wx.login({
            success: (res) => {
                this.loc_login_data = this.loc_login_data || {};
                this.loc_login_data.code = res.code;
                this.getSetting((ret) => {
                    if (ret === 0) {
                        this.getUserInfoWithOutButton(cb);
                    } else {
                        if (cb) cb(0);
                    }
                }, "scope.userInfo")
            },
            fail: () => {
                if (cb) cb(0);
            }
        });
    },

    checkSession(cb) {
        if (!wx.checkSession) return;

        wx.checkSession({
            success: () => {
                cb && cb(0);
            },
            fail: () => {
                cb && cb(-1);
            }
        });
    },

    getSystemInfoSync() {
        if (!this.system_info) {
            this.system_info = wx.getSystemInfoSync();
        }
        return this.system_info;
    },
    //获取平台类别，默认ios
    getPlatformName() {
        let system_info = this.getSystemInfoSync();
        return system_info.platform || "ios";
    },

    createUserInfoButton(cb) {
        let system_info = this.getSystemInfoSync();
        let version = system_info.version;

        if (!wx.createUserInfoButton || version === "6.6.6") return false;

        if (this.btn_userinfo) {
            this.btn_userinfo.destroy();
            this.btn_userinfo = null;
        }

        this.btn_userinfo = wx.createUserInfoButton({
            type: "image",
            image: "images/img_pure.png",
            style: {
                top: 0,
                left: 0,
                width: system_info.screenWidth,
                height: system_info.screenHeight,
            }
        });

        this.btn_userinfo.onTap((res) => {
            this.btn_userinfo.destroy();
            this.btn_userinfo = null;
            if (res && res.userInfo) {
                this.is_authorized = true;
            }
            cb && cb(res);
        });

        return true;
    },

    saveImageToPhotosAlbum(file_path, cb) {
        if (wx.saveImageToPhotosAlbum) {
            wx.saveImageToPhotosAlbum({
                filePath: file_path,
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
    },

    /*
    appid: 要打开的小程序appid
    data: 要传递的数据
    completeCb: 调用接口后的回调
    */
    navigateToProgram(appid, data, cb) {
        if (wx.navigateToMiniProgram) {
            wx.navigateToMiniProgram({
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
    },

    //预览图片
    previewImage(urls, cb) {
        if (!urls || url.length < 1) return;

        if (wx.previewImage) {
            wx.previewImage({
                urls: urls,
                success: () => {
                    cb && cb(0);
                },
                fail: () => {
                    cb && cb(-1);
                }
            });
        }
    },

    isSupportAd() {
        // let system_info = this.getSystemInfoSync();
        // return system_info.SDKVersion >= "2.0.4";
        return false;
    },

    createVideoAd(name) {
        if (!this.isSupportAd()) return;

        !name && (name = "common");

        let adid = this.video_ids[name];
        let handler = this.video_handlers[name];
        if (!handler) {
            handler = wx.createRewardedVideoAd({
                adUnitId: adid
            });

            handler.onError((err) => {
                setTimeout(() => {
                    this.loadVideoAd(name);
                }, 500);
                if (err.errCode) {
                    ya.event.emit(ya.ekey.SHOW_TOAST, { txt: cc.js.formatStr(ya.txt.ad_err_tips, err.errCode.toString()) });
                }
            });

            handler.onLoad(()=>{
                this.video_loadded[name] = true;
            });

            // 用户点击了[关闭广告]按钮
            handler.onClose((res) => {
                // 小于 2.1.0 的基础库版本，res 是一个 undefined
                let is_ended = (res && res.isEnded) || (res === undefined) || false;
                this.video_closes[name] && this.video_closes[name](is_ended);

                this.loadVideoAd(name);
            });
            this.video_handlers[name] = handler;

            this.loadVideoAd(name);
        }
    },
    loadVideoAd(name) {
        this.video_loadded[name] = false;
        this.video_handlers[name].load();
    },
    showVideoAd(name, cb) {
        !cb && (cb = name, name = "common");

        let handler = this.video_handlers[name];
        if (handler) {
            this.video_closes[name] = cb;
            if (this.video_loadded[name]) {
                handler.load();
                handler.show();
            }
            else {
                handler.show();
            }
        }
    },

    showBannerAd() {
        if (!this.isSupportAd()) return;

        this.destoryBannerAd();

        let frame_size = cc.view.getFrameSize();
        this.banner_handler = wx.createBannerAd({
            adUnitId: 'adunit-bc4c247f8cbd5fce',
            style: {
                left: 0,
                top: frame_size.height,
                width: 315,
            }
        });

        this.banner_handler.onResize((res)=>{
            this.banner_handler.style.top = frame_size.height - res.height;
            this.banner_handler.style.left = (frame_size.width - res.width) * 0.5;
        });

        this.banner_handler.show();

        return this.banner_handler
    },
    destoryBannerAd() {
        if (this.banner_handler) {
            this.banner_handler.offError();
            this.banner_handler.offResize();
            this.banner_handler.destory();
            this.banner_handler = null;
        }
    },
    createGameClubButton(params) {
        if (!this.isSupportGameClub()) return;

        if (!this.btn_game_club) {
            this.btn_game_club = wx.createGameClubButton({
                type: "image",
                icon: "white",
                image: ya.res.image_pure,
                style: {
                    top: params.top,
                    left: params.left,
                    width: params.width,
                    height: params.height,
                }
            });
            this.btn_game_club.image = ya.res.image_pure;
        }
        else {
            let style = this.btn_game_club.style;
            style.top = params.top;
            style.left = params.left;
            style.width = params.width;
            style.height = params.height;
        }

        this.btn_game_club.show();
        
        return this.btn_game_club;
    },
    destoryGameClubButton() {
        if (this.btn_game_club) {
            this.btn_game_club.hide();
        }
    },
    isSupportGameClub() {
        let system_info = this.getSystemInfoSync();
        return system_info.SDKVersion >= "2.0.3";
    },
    openCustomerService() {
        if (!this.isSupportCustomerService()) return;

        wx.openCustomerServiceConversation({
            showMessageCard: false,
        });
    },
    isSupportCustomerService() {
        let system_info = this.getSystemInfoSync();
        return system_info.SDKVersion >= "2.0.3";
    },
    setClipboardData(content) {
        !content && (content = "");
        
        wx.setClipboardData({
            data: String(content)
        });
    },

    listen() {
        this._super();

        //菜单栏转发
        wx.showShareMenu({
            withShareTicket: true
        });

        wx.onShareAppMessage(() => {
            return {
                title: ya.txt.share_title_common,
                imageUrl: ya.res.share_common_img,
            };
        });

        if (window['wx'] && window['wx'].getOpenDataContext) {
            window['wx'].getOpenDataContext().postMessage({ action: ya.const.WX.AC_INIT });
        }
    },

    exit() {
        wx.exitMiniProgram();
    },

    hideKeyboard(scb, fcb, ccb) {
        if (wx.hideKeyboard) {
            wx.hideKeyboard({
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
        if (wx.offKeyboardConfirm) {
            wx.offKeyboardConfirm();
        }
        if (wx.offKeyboardInput) {
            wx.offKeyboardInput();
        }
        if (wx.offKeyboardComplete) {
            wx.offKeyboardComplete();
        }
    },

    garbageCollect() {
        wx.triggerGC();
    },

    keepScreenOn() {
        wx.setKeepScreenOn({
            keepScreenOn: true
        });
    },

    share(params) {
        !params && (params = {});

        this.share_cb = params.cb;

        let greater230 = (this.getSystemInfoSync().SDKVersion || "0") >= "2.3.0";

        let query = params.query || "";
        let title = params.title || ya.txt.share_title_common;
        let imageUrl = params.imageUrl || ya.res.image_share_common;

        wx.shareAppMessage({
            title: title,
            imageUrl: imageUrl,
            query: query, //透传参数"key1=1&key2=2"格式

            success: (res) => {
                //基础库版本小于2.3.0有回调
                if (!greater230) {
                    this.share_cb && (this.share_cb(0, res), this.share_cb = null);
                }
            },
            fail: () => {
                //基础库版本小于2.3.0有回调
                if (!greater230) {
                    this.share_cb && (this.share_cb(-1), this.share_cb = null);
                }
            },
        });

        //3s之后自动调用
        setTimeout(() => {
            if (greater230) {
                this.share_cb && (this.share_cb(0, {}), this.share_cb = null);
            }
        }, 3200);
    },
});
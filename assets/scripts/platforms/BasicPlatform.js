/*
平台接口的基础类
*/

cc.Class({
    properties: {
        os_name: "web",

        // 无需做适配的手机品牌
        _not_adapted_brands: [],

        // 需要适配的品牌中为全面屏但是无刘海的手机型号（无需适配）
        // 型号统一用小写
        _not_adapted_modes: [],
    },

    ctor() {
        this.initIPhoneXConfig();

        this.listen();
    },

    //切后台
    onHide() {
        cc.game.on(cc.game.EVENT_HIDE, ()=>{
            ya.event.emit(ya.ekey.ON_HIDE);
        }, this);
    },
    //切前台
    onShow() {
        cc.game.on(cc.game.EVENT_SHOW, (params) => {
            ya.event.emit(ya.ekey.ON_SHOW, params);
        }, this);
    },
    onError() {
        window.onerror = () => {

        };
    },
    //上报数据
    report(params) {

    },
    //检查登录态是否有效
    checkSession(cb) {
        if (cb) cb(0);
    },
    //授权
    authorize() {

    },
    //登录
    login() {

    },
    //创建用户授权按钮
    createUserInfoButton() {
        return true;
    },
    //分享
    share(params) {
        params && params.cb && (params.cb(0, {}));
    },
    //保持屏幕常亮
    keepScreenOn() {

    },
    //隐藏输入键盘
    hideKeyboard() {

    },
    //退出游戏
    exit() {

    },
    //强制更新游戏
    forceUpdate() {

    },
    //获取系统信息
    getSystemInfoSync() {
        return {};
    },
    //设置剪切板数据
    setClipboardData() {

    },
    //是否支持跳转
    isSupportNavigate() {
        return false;
    },
    //是否支持广告
    isSupportAd: function () {
        return false;
    },

    //跳转到第三方程序
    navigateToProgram() {

    },
    //预览图片
    previewImage() {

    },
    //保存图片到相册
    saveImageToPhotosAlbum() {

    },
    //获取用户的设置信息
    getSetting() {

    },
    //打开用户的设置界面
    openSetting(cb) {
        cb && cb(0);
    },
    //垃圾回收
    garbageCollect() {
        cc.sys.garbageCollect();
    },
    //电池电量
    getBatteryLevel() {
        return "0";
    },
    //平台名称
    getPlatformName() {
        return this.os_name;
    },
    //显示banner广告
    showBannerAd() {

    },
    destoryBannerAd() {

    },
    //创建视频广告
    createVideoAd() {

    },
    //显示视频广告
    showVideoAd() {

    },
    //游戏圈
    createGameClubButton() {

    },
    destoryGameClubButton() {

    },
    isSupportGameClub() {
        return false;
    },
    //客服
    openCustomerService() {

    },
    isSupportCustomerService() {
        return false;
    },
    //监听一些平台信息
    listen() {
        this.onShow();

        this.onHide();
    },

    initIPhoneXConfig() {
        // 无需做适配的手机品牌
        this._not_adapted_brands = [
            // "HUAWEI",
            "xiaomi",
            "samsung",
            "oneplus",
            "meizu",
            "honor"
        ];

        // 需要适配的品牌中为全面屏但是无刘海的手机型号（无需适配）
        // 型号统一用小写
        this._not_adapted_modes = [
            "vivo nex",
            "oppo r17",
            "oppo find",
            "vivo x23",
        ];
    },
    //手机品牌是否需要适配
    isAdaptedBrand: function (brand) {
        if (!brand) return false;

        brand = brand.toLowerCase();

        for (let i = 0; i < this._not_adapted_brands.length; i++) {
            if (brand === this._not_adapted_brands[i]) {
                return false;
            }
        }

        return true;
    },
    //手机型号是否需要适配
    isAdaptedMode: function (model) {
        if (!model) return false;

        model = model.toLowerCase();

        for (let i = 0; i < this._not_adapted_modes.length; i++) {
            if (model.indexOf(this._not_adapted_modes[i]) !== -1) {
                return false;
            }
        }

        return true;
    },
    //获取刘海屏偏移量
    getIPhoneXOffsetHeight: function () {
        let t = cc.view.getFrameSize(), height = 0;

        if ((t.width === 1125 && t.height === 2436) || //iPhoneX
            (t.width === 1242 && t.height === 2688)) //iphone XS max
        {
            height = 189;
        }
        else if ((t.width === 375 && t.height === 812) || //iPhoneX
            (t.width === 414 && t.height === 896)) //iphone XS/XS max/XR
        {
            height = 63;
        }
        else if (t.width === 828 && t.height === 1792) { //iphone XR
            height = 126;
        }
        else if (t.width === 1080 && t.height === 2208) { //vivo Y85A
            height = 171;
        }
        else if (t.width === 360 && t.height === 736) { //vivo Y85A
            height = 57;
        }
        else {
            let system_info = this.getSystemInfoSync();
            let status_height = system_info.statusBarHeight || 0;
            if (status_height < 28) {
                height = 0;
            }
            else {
                let model = system_info.model;
                let brand = system_info.brand;
                if (!this.isAdaptedBrand(brand) || !this.isAdaptedMode(model)) {
                    // 无需做适配
                }
                else if (t.width < t.height) { // 未知分辨率机型统一按iphoneX适配
                    height = 63;
                }
            }
        }

        return height;
    },

});
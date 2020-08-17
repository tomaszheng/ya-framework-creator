/*
平台接口的基础类
*/

import YaEventConfig from "../framework/config/YaEventConfig";
import ya from "../framework/ya";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BasicPlatform {
    OS: string = "web";

    // 无需做适配的手机品牌
    notAdaptedBrans = [];

    // 需要适配的品牌中为全面屏但是无刘海的手机型号（无需适配）
    // 型号统一用小写
    notAdaptedModes = [];

    constructor() {
        this.initIPhoneXConfig();

        this.listen();
    }

    //切后台
    onHide() {
        cc.game.on(cc.game.EVENT_HIDE, ()=>{
            ya.eventDispatcher.emit(YaEventConfig.ON_HIDE);
        }, this);
    }

    //切前台
    onShow() {
        cc.game.on(cc.game.EVENT_SHOW, (params:any) => {
            ya.eventDispatcher.emit(YaEventConfig.ON_SHOW, params);
        }, this);
    }

    onError() {
        window.onerror = () => {

        };
    }

    //上报数据
    report(params:any) {

    }

    //检查登录态是否有效
    checkSession(cb:Function|null) {
        if (cb) cb(0);
    }

    //授权
    authorize(scope, cb) {

    }

    //登录
    login(cb?: Function) {

    }

    //分享
    share(params:any) {
        params && params.cb && (params.cb(0, {}));
    }

    //保持屏幕常亮
    keepScreenOn() {

    }

    //隐藏输入键盘
    hideKeyboard(scb, fcb, ccb) {

    }

    //退出游戏
    exit() {

    }

    //强制更新游戏
    forceUpdate() {

    }

    //获取系统信息
    getSystemInfoSync() {
        return {
            statusBarHeight: 0,
            brand: "",
            model: "",
        };
    }

    //设置剪切板数据
    setClipboardData(content) {

    }

    //是否支持跳转
    isSupportNavigate() {
        return false;
    }

    //是否支持广告
    isSupportAd () {
        return false;
    }

    //跳转到第三方程序
    navigateToProgram(appid, data, cb) {

    }

    //预览图片
    previewImage(urls, cb) {

    }

    //保存图片到相册
    saveImageToPhotosAlbum(filePath, cb) {

    }

    //获取用户的设置信息
    getSetting(cb?: Function, scope?: string) {

    }

    //打开用户的设置界面
    openSetting(cb?: Function, scope?: string) {
        cb && cb(0);
    }

    //垃圾回收
    garbageCollect() {
        cc.sys.garbageCollect();
    }

    //电池电量
    getBatteryLevel() {
        return "0";
    }

    //平台名称
    getPlatformName() {
        return this.OS;
    }

    //显示banner广告
    showBannerAd() {

    }

    destoryBannerAd() {

    }

    //创建视频广告
    createVideoAd(name?: string) {

    }

    //显示视频广告
    showVideoAd(cb, name?: string) {

    }

    //游戏圈
    createGameClubButton(params) {

    }

    destoryGameClubButton() {

    }

    isSupportGameClub() {
        return false;
    }

    //客服
    openCustomerService() {

    }

    isSupportCustomerService() {
        return false;
    }

    //监听一些平台信息
    listen() {
        this.onShow();

        this.onHide();
    }

    initIPhoneXConfig() {
        this.notAdaptedBrans = [
            // "HUAWEI",
            "xiaomi",
            "samsung",
            "oneplus",
            "meizu",
            "honor"
        ];

        this.notAdaptedBrans = [
            "vivo nex",
            "oppo r17",
            "oppo find",
            "vivo x23",
        ];
    }

    //手机品牌是否需要适配
    isAdaptedBrand (brand:string) {
        if (!brand) return false;

        brand = brand.toLowerCase();

        for (let i = 0; i < this.notAdaptedBrans.length; i++) {
            if (brand === this.notAdaptedBrans[i]) {
                return false;
            }
        }

        return true;
    }

    //手机型号是否需要适配
    isAdaptedMode (model) {
        if (!model) return false;

        model = model.toLowerCase();

        for (let i = 0; i < this.notAdaptedModes.length; i++) {
            if (model.indexOf(this.notAdaptedModes[i]) !== -1) {
                return false;
            }
        }

        return true;
    }

    //获取刘海屏偏移量
    getIPhoneXOffsetHeight () {
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
            let systemInfo = this.getSystemInfoSync();
            let status_height = systemInfo.statusBarHeight || 0;
            if (status_height < 28) {
                height = 0;
            }
            else {
                let model = systemInfo.model;
                let brand = systemInfo.brand;
                if (!brand || !this.isAdaptedBrand(brand) || !model || !this.isAdaptedMode(model)) {
                    // 无需做适配
                }
                else if (t.width < t.height) { // 未知分辨率机型统一按iphoneX适配
                    height = 63;
                }
            }
        }

        return height;
    }
};

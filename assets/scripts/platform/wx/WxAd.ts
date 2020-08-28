import {EventConfig} from "../../config/EventConfig";
import {GameText} from "../../config/GameText";
import {ya} from "../../framework/ya";
import {BaseAd} from "../BaseAd";

const rewardedVideoAdUnits = {
    general: 'ad-unit-bc4c247f8cbd5fce',
};

const bannerAdUnits = {
    general: 'ad-unit-bc4c247f8cbd5fce',
};

const interstitialAdUnits = {
    general: 'ad-unit-bc4c247f8cbd5fce',
};

interface IRewardVideoAdRecord {
    adName: string;
    handler: wx.RewardedVideoAd;
    loaded: boolean;
    closeCallback?: (isEnded: boolean) => void;
}

class WxAd extends BaseAd {
    bannerHandler: wx.BannerAd = null;
    rewardedVideoHandlers: Map<string, IRewardVideoAdRecord> = null;

    protected init() {
        super.init();
        this.rewardedVideoHandlers = new Map<string, IRewardVideoAdRecord>();
    }

    public createRewardedVideoAd(adName?: string) {
        adName = adName || 'general';
        if (!rewardedVideoAdUnits[adName]) return;

        if (!this.rewardedVideoHandlers.has(adName)) {
            const rewardedVideoHandler = wx.createRewardedVideoAd({
                adUnitId: rewardedVideoAdUnits[adName],
                multiton: true,
            });
            this.rewardedVideoHandlers.set(adName, {
                adName,
                handler: rewardedVideoHandler,
                loaded: false,
            });
            rewardedVideoHandler.onError((res) => {
                setTimeout(() => {
                    this.loadRewardedVideoAd(adName);
                }, 1000);
                if (res.errCode) {
                    ya.eventDispatcher.dispatch(EventConfig.SHOW_TOAST, {
                        txt: cc.js.formatStr(GameText.ad_err_tips, res.errCode.toString())
                    });
                }
            });
            rewardedVideoHandler.onLoad(() => {
                this.rewardedVideoHandlers.get(adName).loaded = true;
            });
            rewardedVideoHandler.onClose((res) => {
                this.rewardedVideoHandlers.get(adName).closeCallback?.call(this, res.isEnded);
                this.loadRewardedVideoAd(adName);
            });
        }

        this.loadRewardedVideoAd(adName);
    }

    private loadRewardedVideoAd(adName: string) {
        if (!this.rewardedVideoHandlers.has(adName)) return;

        const rewardedVideoRecord = this.rewardedVideoHandlers.get(adName);
        rewardedVideoRecord.loaded = false;
        rewardedVideoRecord.handler.load().then();
    }

    public showRewardedVideoAd(adName: string, cb: (isEnded: boolean) => void) {
        if (!this.rewardedVideoHandlers.has(adName)) return;

        const rewardedVideoRecord = this.rewardedVideoHandlers.get(adName);
        rewardedVideoRecord.closeCallback = cb;

        if (rewardedVideoRecord.loaded) {
            rewardedVideoRecord.handler.load().then(() => {
                rewardedVideoRecord.handler.show().then();
            });
        } else {
            rewardedVideoRecord.handler.show().then();
        }
    }

    public showBannerAd(adName?: string) {
        adName = adName || 'general';
        if (!bannerAdUnits[adName]) return;

        this.destroyBannerAd();

        const frameSize = cc.view.getFrameSize();
        this.bannerHandler = wx.createBannerAd({
            adUnitId: bannerAdUnits[adName],
            adIntervals: 40,
            style: {
                left: 0,
                top: frameSize.height,
                width: 315,
                height: 60,
            }
        });

        this.bannerHandler.onResize((res) => {
            this.bannerHandler.style.top = frameSize.height - res.height;
            this.bannerHandler.style.left = (frameSize.width - res.width) * 0.5;
        });

        this.bannerHandler.show().then();
    }

    public destroyBannerAd() {
        if (!this.bannerHandler) return;

        this.bannerHandler.destroy();
        this.bannerHandler = null;
    }

    public showInterstitialAd(adName?: string) {
        adName = adName || 'general';
        if (!interstitialAdUnits[adName]) return;

        const interstitialAd = wx.createInterstitialAd({
            adUnitId: interstitialAdUnits[adName]
        });
        interstitialAd.load().then(() => {
            interstitialAd.show().then();
        });
    }
}

export {WxAd};

import {EventConfig} from "../../config/EventConfig";
import {GameText} from "../../config/GameText";
import {ya} from "../../framework/ya";

class WxAd {
    videoIds: any = {};
    videoHandlers: any = {};
    videoCloses: any = {};
    videoLoaded: any = {};   // 视频广告是否加载成功

    bannerHandler: any = null;

    createVideoAd(name?: string) {
        const adId = this.videoIds[name];
        let handler = this.videoHandlers[name];
        if (!handler) {
            handler = wx.createRewardedVideoAd({
                adUnitId: adId
            });

            handler.onError((err) => {
                setTimeout(() => {
                    this.loadVideoAd(name);
                }, 500);
                if (err.errCode) {
                    ya.eventDispatcher.dispatch(EventConfig.SHOW_TOAST, {
                        txt: cc.js.formatStr(GameText.ad_err_tips, err.errCode.toString())
                    });
                }
            });

            handler.onLoad(() => {
                this.videoLoaded[name] = true;
            });

            // 用户点击了[关闭广告]按钮
            handler.onClose((res) => {
                // 小于 2.1.0 的基础库版本，res 是一个 undefined
                const isEnded = res && res.isEnded || false;
                if (this.videoCloses[name]) this.videoCloses[name](isEnded);

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
        const handler = this.videoHandlers[name];
        if (handler) {
            this.videoCloses[name] = cb;
            if (this.videoLoaded[name]) {
                handler.load();
                handler.show();
            } else {
                handler.show();
            }
        }
    }

    showBannerAd() {
        this.destroyBannerAd();

        const frameSize = cc.view.getFrameSize();
        this.bannerHandler = wx.createBannerAd({
            adUnitId: 'adunit-bc4c247f8cbd5fce',
            adIntervals: 30,
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

        this.bannerHandler.show();

        return this.bannerHandler;
    }

    destroyBannerAd() {
        if (this.bannerHandler) {
            this.bannerHandler.offError();
            this.bannerHandler.offResize();
            this.bannerHandler.destory();
            this.bannerHandler = null;
        }
    }
}

export {WxAd};

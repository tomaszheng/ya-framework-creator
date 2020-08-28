class BaseAd {
    constructor() {
        this.init();
    }

    protected init() {

    }

    public createRewardedVideoAd(adName?: string) {

    }

    public showRewardedVideoAd(adName: string, cb: (isEnded: boolean) => void) {

    }

    public showBannerAd(adName?: string) {

    }

    public destroyBannerAd() {

    }

    public showInterstitialAd(adName?: string) {

    }
}

export {BaseAd};

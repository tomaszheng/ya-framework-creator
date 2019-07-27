/*
音乐播放器
统一处理音效、音乐
*/

cc.Class({
    properties: {
        _effect_mute: false, //临时性的
        _effect_enabled: true,
        effect: {
            get() {
                return this._effect_enabled;
            },
            set(enabled) {
                this._effect_enabled = enabled;
                ya.storage.set(ya.skey.EFFECT_ENABLED, this._effect_enabled);
            }
        },

        _music_enabled: true,
        music: {
            get() {
                return this._music_enabled;
            },
            set(enabled) {
                this._music_enabled = enabled;
                ya.storage.set(ya.skey.MUSIC_ENABLED, this._music_enabled);
            }
        },

        _vibration_enabled: true,
        vibration: {
            get() {
                return this._vibration_enabled;
            },
            set(enabled) {
                this._vibration_enabled = enabled;
                ya.storage.set(ya.skey.VIBRATION_ENABLED, this._vibration_enabled);
            }
        },

        music_name: "",

        is_sining_out: false,
        is_sining_in: false,
    },

    ctor() {
        this._music_enabled = ya.storage.bool(ya.skey.MUSIC_ENABLED, true);

        this._effect_enabled = ya.storage.bool(ya.skey.EFFECT_ENABLED, true);

        this._vibration_enabled = ya.storage.bool(ya.skey.VIBRATION_ENABLED, true);
    },

    //volume: 0.0 ~ 1.0
    setMusicVolume(volume) {
        volume = Number(volume) || 0;
        cc.audioEngine.setMusicVolume(volume);
    },
    getMusicVolume() {
        return cc.audioEngine.getMusicVolume();
    },
    stopMusic() {
        cc.audioEngine.stopMusic();
        this.music_name = "";
    },
    playMusic(name, isloop) {
        if (name === this.music_name) return;

        if (!this._music_enabled) return;

        isloop = Boolean(isloop);

        let audio_chip = cc.loader.getRes(name, cc.AudioClip);
        if (audio_chip) {
            cc.audioEngine.playMusic(audio_chip, isloop);
        }
        else {
            cc.loader.loadRes(name, cc.AudioClip, (err, audio_chip) => {
                if (this.music_name === name) {
                    cc.audioEngine.playMusic(audio_chip, isloop);
                }
            });
        }

        this.music_name = name;
    },
    pauseMusic() {
        cc.audioEngine.pauseMusic();
    },
    resumeMusic() {
        cc.audioEngine.resumeMusic();
    },

    sineOutMusic() {
        if (this.is_sining_out) return;

        this.is_sining_in = false;
        this.is_sining_out = true;

        let volume = this.getMusicVolume();
        let sineout = ()=>{
            if (volume <= 0.02) {
                this.stopMusic();
            }
            if (!this.is_sining_out || volume <= 0.02) {
                this.setMusicVolume(0);
                this.is_sining_out = false;
                return;
            }

            volume = Math.min(volume - 0.01, 0);
            this.setMusicVolume(volume);

            setTimeout(() => {
                sineout();
            }, 50);
        }
        sineout();
    },
    sineInMusic(name, isloop) {
        if (this.is_sining_in) return;

        this.is_sining_in = true;
        this.is_sining_out = false;

        this.playMusic(name, isloop);

        let volume = 0;
        let sinein = ()=>{
            if (volume >= 1) {
                this.playMusic(name, isloop);
            }
            if (!this.is_sining_in || volume >= 1) {
                this.setMusicVolume(1);
                this.is_sining_in = false;
                return;
            }
            volume = Math.min(volume + 0.01, 1);
            this.setMusicVolume(volume);

            setTimeout(() => {
                sinein();
            }, 50);
        }
        sinein();
    },

    playEffect(name, isloop) {
        if (this._effect_mute) return;

        if (!this._effect_enabled) return;

        let audio_chip = cc.loader.getRes(name, cc.AudioClip);
        if (audio_chip) {
            return cc.audioEngine.playEffect(audio_chip, Boolean(isloop));
        }
        else {
            cc.loader.loadRes(name, cc.AudioClip);
        }
    },
    stopEffect(id) {
        cc.audioEngine.stopEffect(id);
    },
    setEffectMute(mute) {
        this._effect_mute = Boolean(mute);
        if (this._effect_mute) {
            cc.audioEngine.stopAllEffects();
        }
    }
});
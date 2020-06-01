/*
音乐播放器
统一处理音效、音乐
*/

import YALocalStorage from "../storage/ya-local-storage";
import YAStorageConfig from "../config/ya-storage-config";

export default class YASoundManager {
    
    private static _instance: YASoundManager;
    static getInstance (): YASoundManager {
        if (!this._instance) {
            this._instance = new YASoundManager();
        }
        return this._instance;
    }

    musicEnabled: boolean = true;
    set music (musicEnabled: boolean) {
        this.musicEnabled = musicEnabled;
        YALocalStorage.getInstance().set(YAStorageConfig.MUSIC_ENABLED, this.musicEnabled);
    }
    get music () {
        return this.musicEnabled;
    }

    effectEnabled: boolean = true;
    set effect (effectEnabled:boolean) {
        this.effectEnabled = effectEnabled;
        YALocalStorage.getInstance().set(YAStorageConfig.EFFECT_ENABLED, this.effectEnabled);
    }
    get effect () {
        return this.effectEnabled;
    }

    _mute: boolean = false;
    set mute (mute: boolean) {
        this._mute = mute;
        YALocalStorage.getInstance().set(YAStorageConfig.SOUND_MUTE, this.mute);
        cc.audioEngine.stopAllEffects();
        cc.audioEngine.stopMusic();
    }
    get mute () {
        return this._mute;
    }

    vibrationEnabled: boolean = true;
    set vibration (vibrationEnabled: boolean) {
        this.vibrationEnabled = vibrationEnabled;
        YALocalStorage.getInstance().set(YAStorageConfig.VIBRATION_ENABLED, this.vibrationEnabled);
    }
    get vibration () {
        return this.vibrationEnabled;
    }

    _musicName:string = "";
    set musicName (name:string) {
        this._musicName = name;
    }
    get musicName () {
        return this._musicName;
    }
    
    private constructor () {
        this.musicEnabled = YALocalStorage.getInstance().bool(YAStorageConfig.MUSIC_ENABLED, true);
        this.effectEnabled = YALocalStorage.getInstance().bool(YAStorageConfig.EFFECT_ENABLED, true);
        this.vibrationEnabled = YALocalStorage.getInstance().bool(YAStorageConfig.VIBRATION_ENABLED, true);
    }

    //volume: 0.0 ~ 1.0
    setMusicVolume (volume:number) {
        volume = Number(volume) || 0;
        cc.audioEngine.setMusicVolume(volume);
    }

    getMusicVolume ():number {
        return cc.audioEngine.getMusicVolume();
    }

    stopMusic () {
        cc.audioEngine.stopMusic();

        this.musicName = "";
    }

    playMusic (name: string, isloop?: boolean) {
        if (name === this.musicName || !this.musicEnabled || !this.mute) return;

        isloop = Boolean(isloop);

        let audioChip = cc.loader.getRes(name, cc.AudioClip);
        if (audioChip) {
            cc.audioEngine.playMusic(audioChip, isloop);
        }
        else {
            cc.loader.loadRes(name, cc.AudioClip, (err, audioChip) => {
                if (this.musicName === name) {
                    cc.audioEngine.playMusic(audioChip, isloop);
                }
            });
        }

        this.musicName = name;
    }

    pauseMusic () {
        cc.audioEngine.pauseMusic();
    }

    resumeMusic () {
        cc.audioEngine.resumeMusic();
    }

    playEffect (name: string, isloop?: boolean):number {
        if (!this.effectEnabled || !this.mute) return -1;

        let audioChip = cc.loader.getRes(name, cc.AudioClip);
        if (audioChip) {
            return cc.audioEngine.playEffect(audioChip, Boolean(isloop));
        }
        else {
            cc.loader.loadRes(name, cc.AudioClip);
        }
        return -1;
    }

    stopEffect (id:number) {
        cc.audioEngine.stopEffect(id);
    }
}

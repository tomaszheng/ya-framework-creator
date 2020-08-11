/*
音乐播放器
统一处理音效、音乐
*/

import YAStorageConfig from "../config/ya-storage-config";
import {Singleton} from "../singleton/Singleton";
import {yaLocalStorage} from "../storage/ya-local-storage";

class YaSoundManager extends Singleton<YaSoundManager> {
    set music (musicEnabled: boolean) {
        this.musicEnabled = musicEnabled;
        yaLocalStorage.setItem(YAStorageConfig.MUSIC_ENABLED, this.musicEnabled);
    }
    get music () {
        return this.musicEnabled;
    }
    set effect (effectEnabled:boolean) {
        this.effectEnabled = effectEnabled;
        yaLocalStorage.setItem(YAStorageConfig.EFFECT_ENABLED, this.effectEnabled);
    }
    get effect () {
        return this.effectEnabled;
    }
    set mute (mute: boolean) {
        this._mute = mute;
        yaLocalStorage.setItem(YAStorageConfig.SOUND_MUTE, this.mute);
        cc.audioEngine.stopAllEffects();
        cc.audioEngine.stopMusic();
    }
    get mute () {
        return this._mute;
    }
    set vibration (vibrationEnabled: boolean) {
        this.vibrationEnabled = vibrationEnabled;
        yaLocalStorage.setItem(YAStorageConfig.VIBRATION_ENABLED, this.vibrationEnabled);
    }
    get vibration () {
        return this.vibrationEnabled;
    }
    set musicName (name:string) {
        this._musicName = name;
    }
    get musicName () {
        return this._musicName;
    }

    musicEnabled = true;

    effectEnabled = true;

    _mute = false;

    vibrationEnabled = true;

    _musicName = "";

    public init() {
        this.musicEnabled = yaLocalStorage.getBool(YAStorageConfig.MUSIC_ENABLED, true);
        this.effectEnabled = yaLocalStorage.getBool(YAStorageConfig.EFFECT_ENABLED, true);
        this.vibrationEnabled = yaLocalStorage.getBool(YAStorageConfig.VIBRATION_ENABLED, true);
    }

    // volume: 0.0 ~ 1.0
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

    playMusic (name: string, isLoop?: boolean) {
        if (name === this.musicName || !this.musicEnabled || !this.mute) return;

        isLoop = Boolean(isLoop);

        const audioChip = cc.loader.getRes(name, cc.AudioClip);
        if (audioChip) {
            cc.audioEngine.playMusic(audioChip, isLoop);
        }
        else {
            cc.loader.loadRes(name, cc.AudioClip, (err, audioClip: cc.AudioClip) => {
                if (this.musicName === name) {
                    cc.audioEngine.playMusic(audioChip, isLoop);
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

    playEffect (name: string, isLoop?: boolean):number {
        if (!this.effectEnabled || !this.mute) return -1;

        const audioChip = cc.loader.getRes(name, cc.AudioClip);
        if (audioChip) {
            return cc.audioEngine.playEffect(audioChip, Boolean(isLoop));
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

const yaSoundManager = YaSoundManager.instance(YaSoundManager);
export {yaSoundManager};
/*
音乐播放器
统一处理音效、音乐
*/

import {Singleton} from "../singleton/Singleton";
import {yaLocalStorage} from "../storage/ya-local-storage";
import {YaStorageConfig} from "../config/YaStorageConfig";
import {yaResourceManager} from "./ya-resource-manager";
import {yaUtils} from "../utils/ya-utils";

interface IAudioRecord {
    path: string;
    audioId: number;
}

class YaSoundManager extends Singleton<YaSoundManager> {
    public set music(musicEnabled: boolean) {
        this._musicEnabled = musicEnabled;
        yaLocalStorage.setItem(YaStorageConfig.MUSIC_ENABLED, this._musicEnabled);
    }

    public get music() {
        return this._musicEnabled;
    }

    public set effect(effectEnabled: boolean) {
        this._effectEnabled = effectEnabled;
        yaLocalStorage.setItem(YaStorageConfig.EFFECT_ENABLED, this._effectEnabled);
    }

    public get effect() {
        return this._effectEnabled;
    }

    public set mute(mute: boolean) {
        this._mute = mute;
        yaLocalStorage.setItem(YaStorageConfig.SOUND_MUTE, this.mute);
        cc.audioEngine.stopAllEffects();
        cc.audioEngine.stopMusic();
    }

    public get mute() {
        return this._mute;
    }

    public set vibration(vibrationEnabled: boolean) {
        this._vibrationEnabled = vibrationEnabled;
        yaLocalStorage.setItem(YaStorageConfig.VIBRATION_ENABLED, this._vibrationEnabled);
    }

    public get vibration() {
        return this._vibrationEnabled;
    }

    public get nextAudioId() {
        return ++this._audioIdSeed;
    }

    private _musicEnabled = true;
    private _effectEnabled = true;
    private _vibrationEnabled = true;
    private _mute = false;
    private _audioIdSeed = 0;

    private _refRecords: Map<string, number>;
    private _audioRecords: Map<number, IAudioRecord>;
    private _musicRecord: { path: string, localId: number };

    public init() {
        this._refRecords = new Map<string, number>();
        this._audioRecords = new Map<number, IAudioRecord>();
        this._musicRecord = {path: '', localId: -1};

        this._musicEnabled = yaLocalStorage.getBool(YaStorageConfig.MUSIC_ENABLED, true);
        this._effectEnabled = yaLocalStorage.getBool(YaStorageConfig.EFFECT_ENABLED, true);
        this._vibrationEnabled = yaLocalStorage.getBool(YaStorageConfig.VIBRATION_ENABLED, true);
    }

    private doPlay(localId: number, audioClip: cc.AudioClip, isLoop: boolean, volume: number, onComplete?: () => void) {
        if (!this._audioRecords.has(localId)) return;

        const audioId = cc.audioEngine.play(audioClip, isLoop, volume);
        const record = this._audioRecords.get(localId);
        record.audioId = audioId;

        cc.audioEngine.setFinishCallback(audioId, () => {
            this.stop(localId);
            yaUtils.doCallback(onComplete);
        });
    }

    private play(path: string, isLoop: boolean, volume: number, onComplete?: ()=>void): number {
        const localId = this.nextAudioId;
        this._audioRecords.set(localId, {audioId: -1, path});

        if (yaResourceManager.isLoaded(path, cc.AudioClip)) {
            const audioClip = yaResourceManager.getAsset(path, cc.AudioClip) as cc.AudioClip;
            this.addRef(path);
            this.doPlay(localId, audioClip, isLoop, volume, onComplete);
        } else {
            yaResourceManager.load(path, cc.AudioClip).then((audioClip: cc.AudioClip) => {
                this.addRef(path);
                this.doPlay(localId, audioClip, isLoop, volume, onComplete);
            });
        }

        return localId;
    }

    public stop(localId: number) {
        if (!this._audioRecords.has(localId)) return;

        const {audioId, path} = this._audioRecords.get(localId);
        this._audioRecords.delete(localId);

        if (audioId !== -1) {
            const state = cc.audioEngine.getState(audioId);
            if (state !== cc.audioEngine.AudioState.STOPPED && state !== cc.audioEngine.AudioState.ERROR) {
                cc.audioEngine.stop(audioId);
            }
            this.decRef(path);
        }

        if (this._musicRecord.localId === localId) {
            this._musicRecord = {path: '', localId: -1};
        }
    }

    public setMusicVolume(volume: number) {
        volume = Number(volume) || 0;
        cc.audioEngine.setMusicVolume(volume);
    }

    public getMusicVolume(): number {
        return cc.audioEngine.getMusicVolume();
    }

    public playMusic(path: string, isLoop?: boolean, onComplete?: () => void) {
        if (path === this._musicRecord.path || !this._musicEnabled || this._mute) return;
        const localId = this.play(path, Boolean(isLoop), this.getMusicVolume(), onComplete);
        this._musicRecord = {path, localId};
    }

    public stopMusic() {
        this.stop(this._musicRecord.localId);

        this._musicRecord = {path: '', localId: -1};
    }

    public pauseMusic() {
        cc.audioEngine.pauseMusic();
    }

    public resumeMusic() {
        cc.audioEngine.resumeMusic();
    }

    public getEffectsVolume(): number {
        return cc.audioEngine.getEffectsVolume();
    }

    public playEffect(path: string, isLoop?: boolean, onComplete?: () => void): number {
        if (!this._effectEnabled || this._mute) return -1;
        return this.play(path, Boolean(isLoop), this.getEffectsVolume(), onComplete);
    }

    public stopEffect(localId: number) {
        this.stop(localId);
    }

    public addRef(path: string) {
        if (this._refRecords.has(path)) {
            const refCount = this._refRecords.get(path);
            this._refRecords.set(path, refCount + 1);
        } else {
            this._refRecords.set(path, 1);
            yaResourceManager.addRef(path, cc.AudioClip);
        }
    }

    public decRef(path: string) {
        if (this._refRecords.has(path)) {
            let refCount = this._refRecords.get(path);
            this._refRecords.set(path, --refCount);
            if (refCount <= 0) {
                this._refRecords.delete(path);
                yaResourceManager.decRef(path, cc.AudioClip);
            }
        }
    }
}

const yaSoundManager = YaSoundManager.instance(YaSoundManager);
export {yaSoundManager};

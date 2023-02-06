import * as R from 'ramda'
import { _decorator, Component, Node, AudioClip, AudioSource, game, assert } from 'cc';
import SingletonComponent from './SingletonComponent';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('SoundMgr')
@requireComponent(AudioSource)
export class SoundMgr extends SingletonComponent<SoundMgr>()
{
    @property(AudioClip) BGM: AudioClip = null;
    @property(AudioClip) SFX_CLICK: AudioClip = null;
    

    public audioSource: AudioSource = null;
    @property(AudioSource) sfxSource: AudioSource = null;

    onLoad() {
        super.onLoad();
        this.audioSource = this.getComponent(AudioSource);
        game.addPersistRootNode(this.node)
    }

    static playSFXByName(name: string | any) {
        SoundMgr.playSfx(R.prop(name, SoundMgr.Instance));
    }

    static playBGMByName(name: string | any) {
        SoundMgr.playMusic(R.prop(name, SoundMgr.Instance));
    }

    static get IsMusicPlaying() {
        const instance = SoundMgr.Instance;
        return instance.audioSource.playing
    }

    static playMusic(clip: AudioClip, loop: boolean = true) {
        if (this.IsMusicPlaying) return;
        const instance = SoundMgr.Instance;
        instance.audioSource.clip = clip;
        instance.audioSource.loop = loop;
        instance.audioSource.play()
    }

    static playSfx(clip: AudioClip | any) {
        const instance = SoundMgr.Instance;
        instance.sfxSource.clip = clip;
        instance.sfxSource.loop = false;
        instance.sfxSource.play()
    }

    static pauseMusic() {
        const instance = SoundMgr.Instance;
        instance.audioSource.pause();
    }

    static pauseSfx() {
        const instance = SoundMgr.Instance;
        instance.sfxSource.pause();
    }

    static stopMusic() {
        const instance = SoundMgr.Instance;
        instance.audioSource.stop();
    }

    static resumeMusic() {
        if (this.IsMusicPlaying) return;
        const instance = SoundMgr.Instance;
        instance.audioSource.play();
    }

    static resumeSfx() {
        const instance = SoundMgr.Instance;
        if (instance.sfxSource.playing) return;
        instance.sfxSource.play();
    }
}

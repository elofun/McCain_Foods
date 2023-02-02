

import { _decorator, Component, Node, sp, VideoPlayer, find, Widget, Game, game } from 'cc';
import { string } from '../../../override_engine/cocos/core/data/decorators';
// import { VideoPlayer } from '../../../override_engine/exports/video';
import { Interact } from '../game/Interactions/Interact';
import { SoundMgr } from '../utils/SoundMgr';
import TrackingManager, { TrackingAction } from './TrackingManager';
const { ccclass, property } = _decorator;

const dataShow = [
    {
        name: 'Fire',
        time: 0,
        anim: 'animation',
    },
    {
        name: 'Tap',
        time: 0.3,
    },
    {
        name: 'TapToBrawl',
        time: 0,
    },
    {
        name: 'DragonSpine',
        time: 10,
        sfx: '',
    },
    {
        name: 'ButtonHaveText',
        time: 16,
        sfx: ''
    },
]

const dataHide = [
    {
        name: 'Tap',
        time: 5.2,
    },
    {
        name: 'TapToBrawl',
        time: 5.2,
    },
    {
        name: 'DragonSpine',
        time: 15.4,
    },
]

const interactions = [
    {
        name: 'Touch',
        timeStart: 0.25,
        jumpTo: 5,
        sfx: '',
    },
    // {
    //     name: 'SwipeRight',
    //     timeStart: 5,
    //     jumpTo: 7.5,
    //     sfx: 'SFX_SWIPE',
    // },
]

const sfx = [
    {
        name: 'start_transit',
        timeStart: 0,
        sfx: 'SFX_TRANSIT_START',
    },
    {
        name: 'scene_2',
        timeStart: 5.25,
        sfx: 'SFX_SCENE_2',
    },
]

@ccclass('VideoController')
export class VideoController extends Component {
    @property(Node)
    public secondarySpines: Node = null;
    @property(Node)
    public interactions: Node = null;
    @property(Node)
    public logo: Node = null;

    protected anim: VideoPlayer = null;
    private isEngaged = false;
    protected bgmDone: Array<string> = [];
    protected sfxDone: Array<string> = [];

    get IsEngaged() {
        return this.isEngaged
    }
    set IsEngaged(isEngaged) {
        this.isEngaged = isEngaged;
    }

    onLoad() {
        this.anim = this.getComponent(VideoPlayer);
        this.node.on('completed', this.sendEventTracking, this)
        this.bgmDone = [];
        this.sfxDone = [];

        // let canvas = find('Canvas');
        // canvas.on('touchstart', () => {
        //     canvas.off('touchstart');
        //     this.anim.play()
        // }, this);

        this.node.on('meta-loaded', () => {
            (<any>(document.getElementsByClassName('cocosVideo')))[0].controls = false;
            (<any>(document.getElementsByClassName('cocosVideo')))[0].poster = 'https://assets.elofun.com/loading-splash-replacement.png';
            this.anim.play();
            document.getElementById('GameCanvas').click();
            setTimeout(() => {
                this.node.setScale(1, 1, 1);
            }, 500)
        }, this)

        game.on(Game.EVENT_SHOW, () => {
            this.anim.play();
        });
    }

    start() {
        if ((<any>window).isOutfit7) {
            this.logo.getComponent(Widget).left = 100;
        }
    }

    update() {
        this.updateHide();
        this.updateShow();
        this.updateInteractions();
        this.updateSFX();
    }

    updateHide() {
        dataHide.forEach((data) => {
            const { name, time, sfx } = data as any;
            if (this.anim.currentTime < time) return;

            const spine = this.secondarySpines.getChildByName(name);
            if (!spine || !spine.active) return;
            spine.active = false;
            spine.name = spine.name + '_DONE';
            if (sfx) {
                SoundMgr.playSFXByName(sfx);
            }
        })
    }

    updateShow() {
        dataShow.forEach((data) => {
            const { name, time, sfx, anim } = data;
            if (this.anim.currentTime < time) return;

            const spine = this.secondarySpines.getChildByName(name);
            if (!spine || spine.active) return;
            spine.active = true;
            if (spine.getComponent(sp.Skeleton) && anim) {
                spine.getComponent(sp.Skeleton).enabled = true;
                spine.getComponent(sp.Skeleton).setAnimation(0, anim, false)
            }
            if (sfx) {
                SoundMgr.playSFXByName(sfx);
            }
        })
    }

    updateInteractions() {
        interactions.forEach((data) => {
            const { name, timeStart, jumpTo, sfx } = data;
            if (this.anim.currentTime < timeStart) return;

            const interact = this.interactions.getChildByName(name);
            if (interact.getComponent(Interact).Done) return;

            if (this.anim.currentTime >= jumpTo) {
                (<any>window).QTE_number++;
                interact.getComponent(Interact).Done = true
                interact.getComponent(Interact).setActive(false);
                TrackingManager.SendEventTracking(TrackingAction.TYPE_QTE_FAILED);
            };
            if (interact.active || interact.getComponent(Interact).Done) return;
            this.interactions.children.forEach((child) => {
                child.getComponent(Interact).setActive(false);
            })
            interact.getComponent(Interact).setActive(true);
            interact.getComponent(Interact).init(jumpTo, sfx);
        })
    }

    updateSFX() {
        sfx.forEach((data) => {
            const { name, timeStart, sfx } = data;
            if (this.anim.currentTime < timeStart) return;
            if (this.sfxDone.findIndex((data) => data === name) >= 0) return;

            SoundMgr.playSFXByName(sfx);
            this.sfxDone.push(name);
        })
    }

    jumpTo(time: number) {
        this.anim.currentTime = time;
    }

    sendEventTracking() {
        if (!this.isEngaged) return;
        TrackingManager.SendEventTracking(TrackingAction.COMPLETE_ENGAGEMENTS);
    }
}
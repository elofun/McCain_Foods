
import { _decorator, Component, Node, sp } from 'cc';
import { string } from '../../../override_engine/cocos/core/data/decorators';
import { Interact } from '../game/Interactions/Interact';
import { SoundMgr } from '../utils/SoundMgr';
import TrackingManager, { TrackingAction } from './TrackingManager';
const { ccclass, property } = _decorator;

const dataShow = [
    {
        name: 'ButtonDontHaveText',
        time: 0,
    },
    {
        name: 'Text',
        time: 11.5,
        sfx: 'SFX_TEXT_MOVE',
    },
    {
        name: 'ButtonHaveText',
        time: 11.5,
    },
]

const dataHide = [
    {
        name: 'ButtonDontHaveText',
        time: 11.5,
    },
]

const interactions = [
    {
        name: 'Touch',
        timeStart: 0.25,
        jumpTo: 5,
        sfx: 'SFX_TAP_BALL',
    },
    {
        name: 'SwipeRight',
        timeStart: 7,
        jumpTo: 11.5,
        sfx: 'SFX_SWIPE',
    },
]

const sfx = [
    {
        name: 'sfx_kick',
        timeStart: 5.5,
        sfx: 'SFX_KICK',
    },
]

@ccclass('SpineController')
export class SpineController extends Component {
    @property(Node)
    public secondarySpines: Node = null;
    @property(Node)
    public interactions: Node = null;

    private anim: any = null;
    private sfxDone: Array<string> = [];
    private isEngaged = false;
    private isCompleted = false;

    get IsEngaged() {
        return this.isEngaged
    }
    set IsEngaged(isEngaged) {
        this.isEngaged = isEngaged;
    }

    onLoad() {
        this.anim = this.getComponent(sp.Skeleton).setAnimation(0, 'animation', false)
        this.sfxDone = [];
        this.getComponent(sp.Skeleton).setCompleteListener(() => {
            if (!this.isEngaged) return;
            TrackingManager.SendEventTracking(TrackingAction.COMPLETE_ENGAGEMENTS);
        })
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
            if (this.anim.trackTime < time) return;

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
            const { name, time, sfx } = data;
            if (this.anim.trackTime < time) return;

            const spine = this.secondarySpines.getChildByName(name);
            if (!spine || spine.active) return;
            spine.active = true;

            if ((<any>window).isOutfit7 && name === 'Text') {
                setTimeout(() => {
                    spine.setPosition(spine.position.x, spine.position.y - 50)
                }, 1)
            }

            if (sfx) {
                SoundMgr.playSFXByName(sfx);
            }
        })
    }

    updateInteractions() {
        interactions.forEach((data) => {
            const { name, timeStart, jumpTo, sfx } = data;
            if (this.anim.trackTime < timeStart) return;

            const interact = this.interactions.getChildByName(name);
            if (interact.getComponent(Interact).Done) return;

            if (this.anim.trackTime >= jumpTo) {
                interact.getComponent(Interact).Done = true
                interact.getComponent(Interact).setActive(false);
                TrackingManager.SendEventTracking(TrackingAction.TYPE_QTE_FAILED);
            };

            if (interact.active) return;
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
            if (this.anim.trackTime < timeStart) return;
            if (this.sfxDone.findIndex((data) => data === name) >= 0) return;

            SoundMgr.playSFXByName(sfx);
            this.sfxDone.push(name);
        })
    }

    jumpTo(time: number) {
        this.anim.trackTime = time;
    }
}
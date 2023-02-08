
import { _decorator, Component, Node, sp, tween } from 'cc';
import { UIOpacity } from '../../../override_engine/cocos/2d';
import { string } from '../../../override_engine/cocos/core/data/decorators';
import { i18n } from '../../i18n/i18n';
import { Interact } from '../game/Interactions/Interact';
import { SoundMgr } from '../utils/SoundMgr';
import TrackingManager, { TrackingAction } from './TrackingManager';
const { ccclass, property } = _decorator;

const dataShow = [

    
    {
        name: 'Text',
        time: 0.8,
        sfx: ''

    },
    {
        name: 'Hand',
        time: 1.5,
        anim: 'Hand',
        sfx: ''

    },
    {
        name: 'Fries',
        time: 6.6,
        sfx: ''
    },
    
    
]

const dataHide = [
    
    {
        name: 'Hand',
        time: 4,
        sfx: ''
    },
    {
        name: 'Text',
        time: 4,
        sfx: ''
    },
]

const interactions = [
    {
        name: 'Touch',
        timeStart: 1.5,
        jumpTo: 4,
        sfx: 'SFX_CLICK',
    },
    
]

const sfx = [
    {
        name: 'Click',
        timeStart: 5.5,
        sfx: 'SFX_CLICK',
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
        this.anim = this.getComponent(sp.Skeleton).setSkin(i18n.language === 0 ? 'ENG' : 'FRANCE')
        this.anim = this.getComponent(sp.Skeleton).setAnimation(0, 'Oven Scene', false)
        


        
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
                return;
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
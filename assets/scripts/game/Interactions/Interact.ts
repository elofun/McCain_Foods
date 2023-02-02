
import { _decorator, Component, Node, CCBoolean } from 'cc';
import { SpineController } from '../../core/SpineController';
import { VideoController } from '../../core/VideoController';
import TrackingManager, { TrackingAction } from '../../core/TrackingManager';
import { SoundMgr } from '../../utils/SoundMgr';
const { ccclass, property } = _decorator;

@ccclass('Interact')
export class Interact extends Component {
    @property(Node)
    public spine: Node = null;
    @property(CCBoolean)
    public isVideo: boolean = false;

    private timeToJumpTo = 0;
    private sfx: any = null;
    protected done = false;

    set Done(done: boolean) {
        this.done = done
    }
    get Done() {
        return this.done;
    }

    callback() {
        (<any>window).QTE_number++;
        if (this.isVideo) {
            this.spine.getComponent(VideoController).jumpTo(this.timeToJumpTo)
            if (!this.spine.getComponent(VideoController).IsEngaged) {
                this.spine.getComponent(VideoController).IsEngaged = true;
                TrackingManager.SendEventTracking(TrackingAction.ENGAGEMENTS);
            }
        } else {
            this.spine.getComponent(SpineController).jumpTo(this.timeToJumpTo)
            if (!this.spine.getComponent(SpineController).IsEngaged) {
                this.spine.getComponent(SpineController).IsEngaged = true;
                TrackingManager.SendEventTracking(TrackingAction.ENGAGEMENTS);
            }
        }

        if (this.sfx) {
            SoundMgr.playSFXByName(this.sfx);
        }
        this.done = true;
        TrackingManager.SendEventTracking(TrackingAction.TYPE_QTE_SUCCESSFUL);
        this.setActive(false);
    }

    init(timeToJumpTo: number, sfx: any) {
        this.timeToJumpTo = timeToJumpTo
        this.sfx = sfx
    }

    setActive(active: boolean) {
        this.node.active = active;
    }
}


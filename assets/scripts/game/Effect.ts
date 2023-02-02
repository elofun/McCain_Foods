
import { _decorator, Component, Node, ccenum, view, Sprite, Animation, AnimationState, Vec3 } from 'cc';
import EventManager from '../core/EventManager';
import { ActionGameObject, DataDrivingTurbo, DataOutOfview, EffectType, EventParameter, EventType } from '../Defines';
const { ccclass, property, requireComponent } = _decorator;

ccenum(EffectType)

@ccclass('Effect')
export class Effect extends Component
{
    @property({
        type: EffectType
    })
    type: EffectType = EffectType.NONE

    @property({
        type: Animation
    })
    anim: Animation = null!

    private _isActive = false
    get isActive(): boolean
    {
        return this._isActive
    }
    set isActive(value: boolean)
    {
        this._isActive = value
        this.SetVisible(value)
    }

    onLoad()
    {
        // only wrapMode = normal can be auto deactive
        this.anim.on(Animation.EventType.FINISHED, this.onAnimFinished, this)
    }

    onDestroy()
    {
        this.anim.off(Animation.EventType.FINISHED, this.onAnimFinished, this)
    }

    onAnimFinished(event: string, animState: AnimationState)
    {
        this.isActive = false
    }

    private SetVisible(visible: boolean)
    {
        if (visible)
        {
            // fixed: anim fly-up not correct position
            this.anim.node.setPosition(Vec3.ZERO)

            this.anim.node.active = true
            this.anim && this.anim.play()
        }
        else
        {
            this.anim && this.anim.stop()
            this.anim.node.active = false
        }
    }
}

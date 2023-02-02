
import { _decorator, Component, Node, AnimationClip, CCBoolean, CCFloat, ccenum, Animation, EventTarget, AnimationState, Sprite, Color } from 'cc';
const { ccclass, property, executeInEditMode, executionOrder, requireComponent } = _decorator;

@ccclass('ISequenceAnimation')
export class ISequenceAnimation
{
    @property({
        type: AnimationClip,
        tooltip: 'Animation clip should not loop',
        serializable: true
    })
    animationClip: AnimationClip | null = null

    @property({
        tooltip: 'Animation clip should be delay before play',
        serializable: true
    })
    isDelay = false

    @property({
        type: CCFloat,
        tooltip: 'delay timer in second',
        serializable: true,
        min: 0,
        step: 0.1
    })
    delayTimer: number = 0.0
}

export enum SequenceWrapModeMask
{
    Default = 0,
    Normal = 1 << 0,
    Loop = 1 << 1,
    ShouldWrap = 1 << 2,
    ForceRebound = 1 << 4,
    PingPong = 1 << 4 | 1 << 1 | 1 << 2,    // ForceRebound, Loop, ShouldWrap
    Reverse = 1 << 5 | 1 << 2,              // ShouldWrap
}

export enum SequenceWrapMode
{
    Default = SequenceWrapModeMask.Default,
    Normal = SequenceWrapModeMask.Normal,
    Reverse = SequenceWrapModeMask.Reverse,
    Loop = SequenceWrapModeMask.Loop,
    LoopReverse = SequenceWrapModeMask.Loop | SequenceWrapModeMask.Reverse,
    PingPong = SequenceWrapModeMask.PingPong,
    PingPongReverse = SequenceWrapModeMask.PingPong | SequenceWrapModeMask.Reverse,
}

ccenum(SequenceWrapMode)

export const SequenceStatus = {
    NONE: 'SequenceEventNone',
    BEGIN: 'SequenceEventBegin',
    NEXT: 'SequenceEventNext',
    END: 'SequenceEventEnd'
}

@ccclass('SequenceAnimation')
@requireComponent(Animation)
// @executionOrder(99)
// @executeInEditMode(true)
export class SequenceAnimation extends Component
{
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;
    @property({
        type: [ISequenceAnimation],
        serializable: true
    })
    clips: ISequenceAnimation[] = []

    @property({
        type: SequenceWrapMode,
        serializable: true
    })
    wrapMode: SequenceWrapMode = SequenceWrapMode.Normal

    @property({
        serializable: true
    })
    transparentOnLoad = false

    @property({
        serializable: true
    })
    playOnLoad = false

    // not init index
    private _currentIndex = -1

    // not init step
    private _nextStep = 0

    // not init status
    private _status = SequenceStatus.NONE;

    private _animationComponent: Animation | null = null
    private _event: EventTarget = new EventTarget()

    onLoad()
    {
        this._animationComponent = this.getComponent(Animation)

        this.reset()
    }


    start()
    {
        if (this.transparentOnLoad)
        {
            const sprite = this.getComponent(Sprite)
            if (sprite)
            {
                sprite.color = Color.TRANSPARENT
            }
        }

        if (this.playOnLoad)
        {
            this.playSequence()
        }
    }

    playSequence()
    {
        if (this._status === SequenceStatus.NONE || this._status === SequenceStatus.END)
        {
            // console.log('Sequence event', this._status)
            this._event.emit(this._status)
            return
        }
        else
        {
            // console.log('Sequence event', this._status, ':', this._currentIndex)
            this._event.emit(this._status, this._currentIndex)
        }

        const clip: ISequenceAnimation = this.clips[this._currentIndex]
        if (clip.isDelay)
        {
            this.scheduleOnce(() =>
            {
                this.playAnimation(clip.animationClip)
            }, clip.delayTimer)
        }
        else
        {
            this.playAnimation(clip.animationClip)
        }
    }

    playAnimation(animationClip: AnimationClip)
    {
        if (!animationClip)
        {
            this.doNext('', null)
            return
        }

        if (animationClip.wrapMode & SequenceWrapModeMask.Loop)
        {
            console.warn(`${animationClip.name} should not LOOP`)
            this._animationComponent.once(Animation.EventType.LASTFRAME, this.doNext, this)
        }
        else
        {
            this._animationComponent.once(Animation.EventType.FINISHED, this.doNext, this)
        }

        this._animationComponent.createState(animationClip, animationClip.name)
        this._animationComponent.play(animationClip.name)
    }

    private doNext(event: string, animState: AnimationState)
    {
        if (event === Animation.EventType.LASTFRAME)
        {
            this._animationComponent.stop()
        }
        // don't clear for optimzie performance
        // this._animationComponent.clips = []

        this.getNextIndex()

        this.playSequence()
    }

    reset()
    {
        this._status = SequenceStatus.NONE
        this._animationComponent.clips = []

        this.getStartIndex()
    }

    getStartIndex()
    {
        if (this.clips.length > 0)
        {
            this._status = SequenceStatus.BEGIN
        }

        if ((this.wrapMode & SequenceWrapModeMask.Reverse) === SequenceWrapModeMask.Reverse)
        {
            this._currentIndex = this.clips.length - 1
            this._nextStep = -1
        }
        else
        {
            this._currentIndex = 0
            this._nextStep = 1
        }
    }

    getNextIndex()
    {
        this._status = SequenceStatus.NEXT
        this._currentIndex += this._nextStep

        if ((this.wrapMode & SequenceWrapModeMask.Loop) === SequenceWrapModeMask.Loop)
        {
            if ((this.wrapMode & SequenceWrapModeMask.ShouldWrap) === SequenceWrapModeMask.ShouldWrap)
            {
                if (this._currentIndex === this.clips.length)
                {
                    if ((this.wrapMode & SequenceWrapModeMask.ForceRebound) === SequenceWrapModeMask.ForceRebound)
                    {
                        this._currentIndex = this.clips.length - 1
                        this._nextStep = -1
                    }
                    else
                    {
                        this._currentIndex = 0
                    }
                }
                else if (this._currentIndex < 0)
                {
                    if ((this.wrapMode & SequenceWrapModeMask.ForceRebound)  === SequenceWrapModeMask.ForceRebound)
                    {
                        this._currentIndex = 0
                        this._nextStep = 1
                    }
                    else
                    {
                        this._currentIndex = this.clips.length - 1
                    }
                }
            }
            else if ((this.wrapMode & SequenceWrapModeMask.Reverse) === SequenceWrapModeMask.Reverse)
            {
                if (this._currentIndex < 0)
                {
                    this._currentIndex = this.clips.length - 1
                }
            }
            else
            {
                if (this._currentIndex === this.clips.length)
                {
                    this._currentIndex = 0
                }
            }
        }
        else
        {
            if (this._currentIndex < 0 || this._currentIndex === this.clips.length)
            {
                this._status = SequenceStatus.END
            }
        }
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.0/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.0/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.0/manual/en/scripting/life-cycle-callbacks.html
 */

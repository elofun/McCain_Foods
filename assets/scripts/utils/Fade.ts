
import { _decorator, Component, Node, CCFloat, tween, color, Color, UIOpacity } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Fade')
export class Fade extends Component {
    @property(UIOpacity)
    overlay: UIOpacity;
    
    @property(CCFloat)
    timeIn: number = 1;

    @property(CCFloat)
    timeOut: number = 1;

    in(callback: Function = undefined)
    {
        this.overlay.opacity = 0;
        tween(this.overlay).to(
            this.timeIn,
            { 
                opacity: 255
            },
            {
                onStart: () =>
                {
                },
                onComplete: () =>
                {
                    this.overlay.opacity = 0;
                    callback && callback();
                }
            }
        ).start();
    }

    out(callback: Function = undefined)
    {
        this.overlay.opacity = 255;
        tween(this.overlay).to(
            this.timeOut,
            { 
                opacity: 0
            },
            {
                onStart: () =>
                {
                },
                onComplete: () =>
                {
                    callback && callback();
                }
            }
        ).start();
    }

    black()
    {
        this.overlay.opacity = 255;
    }
}

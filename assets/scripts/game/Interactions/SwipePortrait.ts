
import { _decorator, Component, Node, CCClass, Vec2, Event } from 'cc';
import { SpineController } from '../../core/SpineController';
import { Interact } from './Interact';
import { SwipeDirection } from './SwipeLanscape';
const { ccclass, property } = _decorator;

@ccclass('SwipePortrait')
export class SwipePortrait extends Interact {
    @property({ type: SwipeDirection })
    public direction: number = SwipeDirection.UP;

    private startPos = new Vec2(0, 0);
    private threshold = 50;
    onLoad() {
        this.node.on(Node.EventType.TOUCH_START, (event: any) => {
            this.startPos = event.getLocation()
        })
        this.node.on(Node.EventType.TOUCH_MOVE, (event: any) => {
            this.callback();

            const touchPos = event.getLocation();
            const vector = new Vec2(touchPos.x - this.startPos.x, touchPos.y - this.startPos.y);

            switch (this.direction) {
                case SwipeDirection.UP: {
                    if (vector.y > this.threshold) {
                        this.callback();
                    }
                    break;
                }
                case SwipeDirection.DOWN: {
                    if (vector.y < -this.threshold) {
                        this.callback();
                    }
                    break;
                }
                case SwipeDirection.RIGHT: {
                    if (vector.x > this.threshold) {
                        this.callback();
                    }
                    break;
                }
                case SwipeDirection.LEFT: {
                    if (vector.y > this.threshold) {
                        this.callback();
                    }
                    break;
                }
            }
        })
    }
}


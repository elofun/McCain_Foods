
import { _decorator, Component, Node, CCClass, Vec2, Event, Enum } from 'cc';
import { SpineController } from '../../core/SpineController';
import { Interact } from './Interact';
const { ccclass, property } = _decorator;
export const SwipeDirection = Enum({
    UP: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3,
})

@ccclass('SwipeLanscape')
export class SwipeLanscape extends Interact {
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
                case SwipeDirection.LEFT: {
                    if (vector.y > this.threshold) {
                        this.callback();
                    }
                    break;
                }
                case SwipeDirection.RIGHT: {
                    if (vector.y < -this.threshold) {
                        this.callback();
                    }
                    break;
                }
                case SwipeDirection.UP: {
                    if (vector.x > this.threshold) {
                        this.callback();
                    }
                    break;
                }
                case SwipeDirection.DOWN: {
                    if (vector.y > this.threshold) {
                        this.callback();
                    }
                    break;
                }
            }
        })
    }
}


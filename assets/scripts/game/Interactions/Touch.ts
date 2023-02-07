
import { _decorator, Component, Node } from 'cc';
import { SpineController } from '../../core/SpineController';
import { Interact } from './Interact';
const { ccclass, property } = _decorator;

@ccclass('Touch')
export class Touch extends Interact {
    onLoad() {
        this.node.on(Node.EventType.TOUCH_END, () => {
            console.log("Asd")
            this.callback();
        })
    }
}


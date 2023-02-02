
import { _decorator, Component, Node, Label, Sprite, UITransform, Vec3, Button, CCString, RichText } from 'cc';
import EventManager from './core/EventManager';
import { RedirectInfo } from './core/Utils';
import { ActionSystem, EventType } from './Defines';
const { ccclass, property } = _decorator;

@ccclass('ButtonInfo')
export class ButtonInfo extends Component {
    @property(CCString)
    textAdvertising: string = "Advertising";

    @property(CCString)
    customTracking: string = "";

    @property(RichText)
    lblLeft: RichText;

    @property(RichText)
    lblRight: RichText;

    @property(Sprite)
    spriteIcon: Sprite;

    @property(Button)
    buttonInfo: Button;

    onEnable() {
        this.SetText();
    }

    start() {
        EventManager.GetInstance().on(EventType.SYSTEM, this.OnInterruptEvent, this);
    }

    SetText() {
        let spacing = 5;
        let iconSize = this.spriteIcon.getComponent(UITransform).contentSize;

        this.lblLeft.string = this.lblLeft.string.replace('%s', this.textAdvertising);

        this.lblRight.string = this.lblRight.string.replace('%s', this.textAdvertising);
    }

    OnClick() {
        if (!(<any>window).CC_DEBUG && !(<any>window).REVIEW) {
            this.buttonInfo.interactable = false;
        }
        RedirectInfo(this.customTracking);
    }

    OnInterruptEvent(parameters: any) {
        if (!this.node.active) {
            return;
        }

        switch (parameters.action) {
            case ActionSystem.PAUSE:
                break;

            case ActionSystem.RESUME:
                this.buttonInfo.interactable = true;
                break;
        }
    }
}


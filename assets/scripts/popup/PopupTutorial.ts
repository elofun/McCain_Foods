
import { _decorator, Component, Vec3, tween, UITransform, view, Node } from 'cc';
import EventManager from '../core/EventManager';
import { ActionPopupTutorial, EventType } from '../Defines';
const { ccclass, property } = _decorator;

@ccclass('PopupTutorial')
export class PopupTutorial extends Component
{
    @property(Node)
    container: Node;

    onEnable()
    {
        this.container.setScale(new Vec3(0, 0, 1));
        tween(this.container).to(0.5, { scale: new Vec3(1, 1, 1) }, { easing: 'elasticOut' }).start();

        this.node.getComponent(UITransform).contentSize = view.getVisibleSize();
    }

    start()
    {
    }

    Show()
    {
        this.node.active = true;
    }

    Hide(callback: any)
    {
        tween(this.container).to(0.5, { scale: new Vec3(0, 0, 1) }, { easing: 'elasticIn' }).call(() =>
        {
            this.node.active = false;
            callback();
        }).start();
    }

    OnHide()
    {
        let paramaters = {
            action: ActionPopupTutorial.HIDE,
            data: {}
        }
        EventManager.GetInstance().emit(EventType.POPUP_TUTORIAL, paramaters);
    }
}


import { _decorator, Component, Node, Label, Sprite, SpriteFrame, UITransform, Vec3, CCString } from 'cc';
import { GetRewardAmount, GetRewardIcon, GetSpriteFrameFromUrl } from './core/Utils';
const { ccclass, executeInEditMode, property } = _decorator;

@ccclass('Token')
@executeInEditMode(true)
export class Token extends Component
{
    @property(CCString)
    textReward: string = "Play game and get %d %token%";

    @property(Label)
    lblLeft: Label;

    @property(Label)
    lblRight: Label;

    @property(Sprite)
    spriteIcon: Sprite;

    onEnable()
    {
        this.SetText(this.textReward);
    }

    SetText(text: string)
    {
        let texts = text.replace("%d", "" + GetRewardAmount()).split("%token%");
        let url = `https://cdn.gold.g4b.gameloft.com/${GetRewardIcon()}`

        GetSpriteFrameFromUrl(url)
            .then((spriteFrame: SpriteFrame) =>
            {
                this.spriteIcon.spriteFrame = spriteFrame;
            })
            .catch(error =>
            {

            })

        let spacing = 5;
        let iconSize = this.spriteIcon.getComponent(UITransform).contentSize;

        this.lblLeft.string = texts[0];
        this.lblLeft.node.position = new Vec3(-iconSize.x / 2 - spacing, 0, 0);

        this.lblRight.string = texts[1];
        this.lblRight.node.position = new Vec3(iconSize.x / 2 + spacing, 0, 0);
    }
}


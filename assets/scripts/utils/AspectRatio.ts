
import { _decorator, Component, Node, CCFloat, UITransform, Enum, Size, view, CCInteger } from 'cc';
const { ccclass, property } = _decorator;

export const Constraint = Enum({
    WIDTH: 0,
    HEIGHT: 1,
    CONTAIN: 2,
    COVER: 3
});


let visibleRatio = true
@ccclass('AspectRatio')
export class AspectRatio extends Component
{
    @property(Node)
    target: Node | null = null

    @property({
        type: CCFloat,
        visible: () => visibleRatio
    })
    designRatio: number = 16 / 9;

    @property({
        type: CCInteger,
        min: 1
    })
    rawWidth: number = 1

    @property({
        type: CCInteger,
        min: 1
    })
    rawHeight: number = 1

    @property({
        type: Constraint,
        serializable: true
    })
    _constraint = Constraint.WIDTH

    @property({
        type: Constraint,
        tooltip: 'designRatio will be ignored if choosing CONTAIN or COVER'
    })
    get constraint()
    {
        return this._constraint
    }
    set constraint(value)
    {
        if (this._constraint === value)
        {
            return
        }

        this._constraint = value
        visibleRatio = (value === Constraint.WIDTH || value === Constraint.HEIGHT)

        this.updateLayout()
    }

    onLoad()
    {
        this.updateLayout()
    }

    updateLayout()
    {
        let size = this.target ? this.target.getComponent(UITransform).contentSize : view.getVisibleSize();
        let uiTransform = this.getComponent(UITransform);

        const ratioW = size.width / this.rawWidth
        const ratioH = size.height / this.rawHeight

        if (this.constraint == Constraint.WIDTH)
        {
            uiTransform.contentSize = new Size(size.width, size.width / this.designRatio);
        }
        else if (this.constraint == Constraint.HEIGHT)
        {
            uiTransform.contentSize = new Size(size.height * this.designRatio, size.height);
        }
        else if (this.constraint == Constraint.CONTAIN)
        {
            if (ratioW < ratioH)
            {
                uiTransform.contentSize = new Size(size.width, this.rawHeight * ratioW);
            }
            else
            {
                uiTransform.contentSize = new Size(this.rawWidth * ratioH, size.height);
            }
        }
        else if (this.constraint == Constraint.COVER)
        {
            if (ratioW < ratioH)
            {
                uiTransform.contentSize = new Size(this.rawWidth * ratioH, size.height);
            }
            else
            {
                uiTransform.contentSize = new Size(size.width, this.rawHeight * ratioW);
            }
        }
    }
}

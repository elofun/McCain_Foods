
import { _decorator, Component, Node, Vec2, CCInteger, Vec3, misc, CCFloat } from 'cc';
import { Config } from '../Defines';
const { ccclass, property, executionOrder, executeInEditMode } = _decorator;

@ccclass('LanesConfig')
@executionOrder(-1000)
@executeInEditMode(true)
export class LanesConfig extends Component
{
    @property({
        type: Vec2
    })
    get roadPatternOffset(): Vec2
    {
        return this._roadPatternOffset
    }
    set roadPatternOffset(value: Vec2)
    {
        if (value.equals(this._roadPatternOffset))
        {
            return
        }

        this._roadPatternOffset.set(value)
        this.updateConfig()
    }

    @property({
        serializable: true
    })
    _roadPatternOffset = new Vec2(Vec2.ZERO)

    @property({
        type: Vec2,
        tooltip: 'Apply to lane center points, x = offset mid lane, y = offset top & bottom lane'
    })
    get laneCenterOffset(): Vec2
    {
        return this._laneCenterOffset
    }
    set laneCenterOffset(value: Vec2)
    {
        if (this._laneCenterOffset.equals(value))
        {
            return
        }

        this._laneCenterOffset = value
        this.updateConfig()
    }
    @property({
        serializable: true
    })
    _laneCenterOffset = new Vec2(Vec2.ZERO)

    @property({
        type: CCInteger,
        step: 10,
        tooltip: 'Apply to lane left points'
    })
    get laneLeftDistance(): number
    {
        return this._laneLeftDistance
    }
    set laneLeftDistance(value: number)
    {
        if (value === this._laneLeftDistance)
        {
            return
        }
        this._laneLeftDistance = value
        this.updateConfig()
    }
    @property({
        type: CCInteger,
        serializable: true
    })
    _laneLeftDistance = 0

    @property({
        type: CCInteger,
        step: 10,
        tooltip: 'Apply to lane right points'
    })
    get laneRightDistance(): number
    {
        return this._laneRightDistance
    }
    set laneRightDistance(value: number)
    {
        if (value === this._laneRightDistance)
        {
            return
        }
        this._laneRightDistance = value
        this.updateConfig()
    }
    @property({
        type: CCInteger,
        serializable: true
    })
    _laneRightDistance = 0

    @property({
        type: CCFloat,
        step: 1.0,
        min: 1.0,
        tooltip: 'Apply to find perpendicular vector with road'
    })
    get eyeRatio(): number
    {
        return this._eyeRatio
    }
    set eyeRatio(value: number)
    {
        if (value === this._eyeRatio)
        {
            return
        }
        this._eyeRatio = value
        this.updateConfig()
    }
    @property({
        type: CCFloat,
        serializable: true
    })
    _eyeRatio = 1.0

    @property(Node)
    leftTopLane: Node = null!
    @property(Node)
    leftMidLane: Node = null!
    @property(Node)
    leftBottomLane: Node = null!

    @property(Node)
    centerTopLane: Node = null!
    @property(Node)
    centerMidLane: Node = null!
    @property(Node)
    centerBottomLane: Node = null!

    @property(Node)
    rightTopLane: Node = null!
    @property(Node)
    rightMidLane: Node = null!
    @property(Node)
    rightBottomLane: Node = null!

    onLoad()
    {
        this.updateConfig()
    }

    updateConfig()
    {
        const roadPatternOffset = new Vec3(this.roadPatternOffset.x, this.roadPatternOffset.y, 0)
        const roadDirection = Vec3.normalize(new Vec3(), roadPatternOffset)

        this.updateConfigCenterPoints(roadDirection, this.laneCenterOffset.x, this.laneCenterOffset.y)

        this.updateConfigLeftPoints(roadDirection, this.laneLeftDistance)
        this.updateConfigRightPoints(roadDirection, this.laneRightDistance)
    }

    updateConfigLeftPoints(dir: Vec3, distance: number)
    {
        let top = this.centerTopLane.getPosition()
        Vec3.add(top, top, Vec3.multiplyScalar(new Vec3(), dir, distance))

        let mid = this.centerMidLane.getPosition()
        Vec3.add(mid, mid, Vec3.multiplyScalar(new Vec3(), dir, distance))

        let bottom = this.centerBottomLane.getPosition()
        Vec3.add(bottom, bottom, Vec3.multiplyScalar(new Vec3(), dir, distance))

        this.leftTopLane.setPosition(top)
        this.leftMidLane.setPosition(mid)
        this.leftBottomLane.setPosition(bottom)
    }

    updateConfigRightPoints(dir: Vec3, distance: number)
    {
        let top = this.centerTopLane.getPosition()
        Vec3.add(top, top, Vec3.multiplyScalar(new Vec3(), dir, distance))

        let mid = this.centerMidLane.getPosition()
        Vec3.add(mid, mid, Vec3.multiplyScalar(new Vec3(), dir, distance))

        let bottom = this.centerBottomLane.getPosition()
        Vec3.add(bottom, bottom, Vec3.multiplyScalar(new Vec3(), dir, distance))

        this.rightTopLane.setPosition(top)
        this.rightMidLane.setPosition(mid)
        this.rightBottomLane.setPosition(bottom)
    }

    updateConfigCenterPoints(dir: Vec3, offsetX: number, offsetY: number)
    {
        let angleRadian = Math.atan2(dir.y, dir.x)

        let mid = new Vec3(Vec3.ZERO)
        Vec3.multiplyScalar(mid, dir, offsetX)

        let top = new Vec3(0, offsetY, 0)
        Vec3.rotateZ(top, top, Vec3.ZERO, this.eyeRatio * angleRadian)
        Vec3.add(top, top, mid)

        let bottom = new Vec3(0, -offsetY, 0)
        Vec3.rotateZ(bottom, bottom, Vec3.ZERO, this.eyeRatio * angleRadian)
        Vec3.add(bottom, bottom, mid)

        this.centerTopLane.setPosition(top)
        this.centerMidLane.setPosition(mid)
        this.centerBottomLane.setPosition(bottom)
    }
}



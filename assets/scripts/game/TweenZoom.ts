
import { _decorator, Component, Vec3, Node, CCFloat, Tween, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TweenZoom')
export class TweenZoom extends Component {
    @property(CCFloat) scaleIn: number;
    @property(CCFloat) scaleOut: number;

    onEnable() {
        this.node.setScale(new Vec3(0, 0, 1));
        setTimeout(() => {
            tween(this.node)
                .to(1, { scale: new Vec3(this.scaleOut, this.scaleOut, 1) }, { easing: 'fade' })
                .call(() => {
                    tween(this.node)
                        .repeatForever(
                            tween(this.node)
                                .to(1.3, { scale: new Vec3(this.scaleIn, this.scaleIn, 1) })
                                .to(1.3, { scale: new Vec3(this.scaleOut, this.scaleOut, 1) })
                        ).start();
                }
                )
                .start();
        }, 100)

    }
}

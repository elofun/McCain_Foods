
import { _decorator, Component, Node, view, Vec3, UITransform, macro, director, game, Game } from 'cc';
import EventManager from './core/EventManager';
import { ActionSystem, Config, EventType } from './Defines';
import FingerprintJS from '@fingerprintjs/fingerprintjs/dist/fp.cjs.js';
import { SoundMgr } from './utils/SoundMgr';

const { ccclass, property } = _decorator;

@ccclass('GameInit')
export class GameInit extends Component {
    @property(Node)
    portrait: Node;

    @property(Node)
    landscape: Node;

    onLoad() {
        if ((<any>window).isOutfit7) {
            FingerprintJS.load()
                .then(fp => fp.get())
                .then(result => {
                    (<any>window).anonymous = result.visitorId
                    this.Alignment();
                    this.Init();
                })
        }
        else {
            this.Init();
            this.Alignment();
        }

        game.on(Game.EVENT_HIDE, () => {
            SoundMgr.pauseMusic();
            SoundMgr.pauseSfx();
        });

        game.on(Game.EVENT_SHOW, () => {
            setTimeout(() => {
                SoundMgr.resumeMusic();
                SoundMgr.resumeSfx();
            }, 250)
        });
    }

    start() {

    }

    // update (deltaTime: number) {
    //     // [4]
    // }

    Init() {
        (<any>window).gTotalTimeSpent = 0;
        (<any>window).gIngameTimeSpent = 0;
        (<any>window).gLoadingTimeSpent = 0;

        this.FunctionDefines();

        SoundMgr.playMusic(SoundMgr.Instance.BGM, true);
    }

    Alignment() {
        let viewDesign = view.getDesignResolutionSize();
        let isMigGamePortrait = false
        let viewVisible = view.getVisibleSize();
        let isHostGamePortrait = window.innerWidth < window.innerHeight;

        if (!view.isRotate()) {
            if (isMigGamePortrait) {
                view.setOrientation(macro.ORIENTATION_PORTRAIT);
                // if ((<any>window).isOutfit7)
                // {
                //     view.setRotateAngle(90);
                // }
                // else
                // {
                view.setRotateAngle(-90);
                // }
                if (!isHostGamePortrait) {
                    this.portrait.active = false;
                    this.landscape.active = true;
                }
                else {
                    this.portrait.active = true;
                    this.landscape.active = false;
                    this.portrait.getComponent(UITransform).setContentSize(viewVisible);
                }
            }
            else {
                this.portrait.active = false;
                this.landscape.active = true;
                this.landscape.getComponent(UITransform).setContentSize(viewVisible);
            }
        }
        else {
            if (isMigGamePortrait) {
                view.setOrientation(macro.ORIENTATION_PORTRAIT);
                if (!(<any>window).isOutfit7) {
                    view.setRotateAngle(-90);
                } else if (isHostGamePortrait) {
                    view.setRotateAngle(-90);
                }

                if (!isHostGamePortrait) {

                    this.portrait.active = false;
                    this.landscape.active = true;
                    this.landscape.getComponent(UITransform).setContentSize(viewVisible);
                }
                else {
                    this.portrait.active = true;
                    this.landscape.active = false;
                    this.portrait.getComponent(UITransform).setContentSize(viewVisible);
                }
                // let ratio = window.innerHeight / window.innerWidth;
                // if (Config.isSupportTwoScreenSize)
                // {
                //     this.landscape.active = true;
                //     this.landscape.eulerAngles = new Vec3(0, 0, -90);
                //     this.landscape.getComponent(UITransform).setContentSize(viewVisible.height, viewVisible.height * ratio);
                // }
                // else
                // {
                //     this.portrait.active = true;
                //     this.portrait.getComponent(UITransform).setContentSize(viewVisible.height * ratio, viewVisible.height);
                // }
            }
            else {
                view.setOrientation(macro.ORIENTATION_LANDSCAPE);
                // if ((<any>window).isOutfit7)
                // {
                view.setRotateAngle(90);
                // }
                // else
                // {
                //     view.setRotateAngle(-90);
                // }

                let ratio = window.innerWidth / window.innerHeight;
                if (Config.isSupportTwoScreenSize) {
                    this.portrait.active = true;
                    this.portrait.getComponent(UITransform).setContentSize(viewVisible.width * ratio, viewVisible.width);
                }
                else {
                    this.landscape.active = true;
                    this.landscape.getComponent(UITransform).setContentSize(viewVisible.width, viewVisible.width * ratio);
                }
            }
        }
    }

    FunctionDefines() {
        let mainWindow = (<any>window);
        mainWindow.onGamePause = function () {
            let parameters = {
                action: ActionSystem.PAUSE,
                data: {}
            };

            director.pause();
            EventManager.GetInstance().emit(EventType.SYSTEM, parameters);
        }

        mainWindow.onGameResume = function () {
            let parameters = {
                action: ActionSystem.RESUME,
                data: {}
            };

            director.resume();
            EventManager.GetInstance().emit(EventType.SYSTEM, parameters);
        }

        mainWindow.onBackPressed = function () {
            let parameters = {
                action: ActionSystem.BACK,
                data: {}
            };

            EventManager.GetInstance().emit(EventType.SYSTEM, parameters);
        }

        let GLADS_CONTROLLER_EVENT_BUTTON_B = 16;
        mainWindow.onControllerEvent = function (button: any, value: any) {
            // only support B button from controller for now
            if (button === GLADS_CONTROLLER_EVENT_BUTTON_B) {
                if (value === 0) {
                    let parameters = {
                        action: ActionSystem.BACK,
                        data: {}
                    };
                    EventManager.GetInstance().emit(EventType.SYSTEM, parameters);
                }
            }
        }
    }
}

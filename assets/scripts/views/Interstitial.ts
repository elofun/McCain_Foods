import { _decorator, Component, Node, sys, tween, Tween, Widget, view, Button } from 'cc';
import { ActionSystem, EventType } from '../Defines';
import { DispatchEvent, HideLoadingIcon, PauseHostGameMusic, RegisterVisibilityChange, SendTrackingAndExit } from '../core/Utils';
import TrackingManager, { TrackingAction, TrackingFormat } from '../core/TrackingManager';
import EventManager from '../core/EventManager';
import Resource from '../core/Resource';
import { Fade } from '../utils/Fade';
import { SoundMgr } from '../utils/SoundMgr';

const { ccclass, property } = _decorator;

@ccclass('Interstitial')
export class Interstitial extends Component {
    @property(Node)
    exitBtn: Node = null;

    @property(Node)
    infoBtn: Node = null;

    @property(Node)
    token: Node = null;

    @property(Node)
    buttonPlay: Node = null;

    @property(Button)
    btnCTA: Button = null;

    onLoad() {
        PauseHostGameMusic();
        HideLoadingIcon();

        if ((<any>window).isOutfit7) {
            RegisterVisibilityChange();
            this.exitBtn.active = false;
        }

        let pixelUrl = Resource.GetParam("impression_url");
        if (pixelUrl && pixelUrl.startsWith("http") && !(<any>window).isOutfit7) {
            pixelUrl = pixelUrl.replace("{[timestamp]}", "[timestamp]");
            pixelUrl = pixelUrl.replace("[timestamp]", Date.now());
            TrackingManager.SetPixelTracking(TrackingAction.IMPRESSIONS, pixelUrl);
        }
        TrackingManager.SendEventTracking([TrackingAction.AD_LOADED, TrackingAction.IMPRESSIONS]);

        if (TrackingManager.format == TrackingFormat.BLS ||
            TrackingManager.format == TrackingFormat.VHERO ||
            TrackingManager.format == TrackingFormat.VSCORE ||
            TrackingManager.format == TrackingFormat.VIDEO_FORM ||
            TrackingManager.format == TrackingFormat.VINT ||
            TrackingManager.format == TrackingFormat.FAKE_CALL ||
            TrackingManager.format == TrackingFormat.FAKE_CALL_VIDEO ||
            TrackingManager.format == TrackingFormat.MINT_MIG ||
            TrackingManager.format == TrackingFormat.VSTORY ||
            TrackingManager.format == TrackingFormat.HYBRID ||
            TrackingManager.format == TrackingFormat.FORM_INTERACTIONS) {
            (<any>window).gTotalTimeSpent = 0.01;
        }
        let viewDesign = view.getDesignResolutionSize();
        let viewVisible = view.getVisibleSize();
        if (view.isRotate()) {
            this.exitBtn.getComponent(Widget).right = this.exitBtn.getComponent(Widget).right + 0.5 * (viewDesign.width - viewVisible.width);
            let temp = viewVisible.height / viewVisible.width >= 1.97 ? 0.35 : 0.5;
            this.infoBtn.getComponent(Widget).left = this.infoBtn.getComponent(Widget).left + temp * (viewDesign.width - viewVisible.width);
        }
    }

    OnCta() {
        if (!(<any>window).CC_DEBUG && !(<any>window).REVIEW) {
            this.btnCTA.interactable = false;
        }
        this.OpenProductLink();
    }

    OpenProductLink() {
        try {
            let redirectLink = Resource.GetParam("redirect_url");
            if (!(<any>window).omsPublish || (<any>window).REVIEW) {
                if (redirectLink == "redirect_url") {
                    redirectLink = "https://google.com";
                }
                sys.openURL(redirectLink);
            }
            else {
                if (!(<any>window).isOutfit7) {
                    TrackingManager.SendEventTracking(TrackingAction.CLICK_THROUGHTS_START);
                    TrackingManager.SendEventTracking(TrackingAction.CLICK_THROUGHTS, null, "N/A", redirectLink);
                }
                else {
                    TrackingManager.SendEventTracking(TrackingAction.CLICK_THROUGHTS_START, () => {
                        TrackingManager.SendEventTracking(TrackingAction.CLICK_THROUGHTS, null, "N/A", redirectLink);
                    });
                }
            }
        }
        catch (e) {

        }
    }

    start() {
        EventManager.GetInstance().on(EventType.SYSTEM, this.OnInterruptEvent, this);
        TrackingManager.SendEventTracking(TrackingAction.AD_VIEWABLE);
        DispatchEvent("document_ready");
        DispatchEvent("touchstart");
    }

    onDestroy() {
        EventManager.GetInstance().off(EventType.SYSTEM, this.OnInterruptEvent, this);
    }

    update(deltaTime: number) {

    }

    OnExit() {
        SendTrackingAndExit();
    }

    OnInterruptEvent(parameters: any) {
        if (!this.node.active) {
            return;
        }

        switch (parameters.action) {
            case ActionSystem.PAUSE:
                break;

            case ActionSystem.RESUME:
                this.btnCTA.interactable = true;
                break;

            case ActionSystem.BACK:
                this.OnExit();
                break;
        }
    }
}

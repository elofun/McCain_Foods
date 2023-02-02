import { assetManager, ImageAsset, Sprite, SpriteFrame, Texture2D } from "cc";
import Resource from "./Resource";
import TrackingManager, { TrackingAction } from "./TrackingManager";

/**
 * Random a float number
 * @param min
 * @param max
 * @returns number
 */
export function Rand(min: number, max: number): number
{
    return (Math.random() * (max - min)) + min;
}

/**
 * Random a integer number min max inclusive
 * @param min
 * @param max
 * @returns number
 */
export function RandInt(min: number, max: number): number
{
    return Math.floor((Math.random() * (max - min + 1)) + min);
}

/**
 * Get SpriteFrame from URL
 * @param url
 * @returns SpriteFrame
 */
export function GetSpriteFrameFromUrl(url: string): Promise<SpriteFrame>
{
    return new Promise<SpriteFrame>((resolve, reject) =>
    {
        assetManager.loadRemote<ImageAsset>(url, { xhrMimeType: "image/png" }, (error, imageAsset) =>
        {
            if (!error)
            {
                const spriteFrame = new SpriteFrame();
                const texture = new Texture2D();
                texture.image = imageAsset;
                spriteFrame.texture = texture;

                resolve(spriteFrame);
            }
            else
            {
                reject(null);
            }
        });
    });
}

/**
 * Get reward amount from glads server
 * @returns number
 */
export function GetRewardAmount(): number
{
    if ((typeof (<any>window).reward_amount) != 'undefined')
    {
        return (<any>window).reward_amount;
    }
    return 5;
};

/**
 * Get reward icon name from glads server
 * @returns reward icon name
 */
export function GetRewardIcon(): string
{
    const IsSupportReward = () =>
    {
        return (<any>window).reward_currency && (<any>window).reward_currency != '{[rewardCurrency]}';
    }

    if (`${Resource.args['game_id']}` == "649")
    {
        return 'reward.121.default.png';
    }

    let currency = IsSupportReward() ? (<any>window).reward_currency : 'default';
    return `reward.${Resource.args['game_id'] || '121'}.${currency}.png`;
}

/**
 * Hide init loading icon
 */
export function HideLoadingIcon()
{
    let splash = document.getElementById("splash");
    if (splash)
    {
        splash.style.display = "none";
    }
}

/**
 * Pause the host game music
 */
export function PauseHostGameMusic()
{
    if ((<any>window).can_pause_music && (<any>window).can_pause_music == '1')
    {
        (<any>window).location = "pauseusermusic:";
    }
}

/**
 * Open the redirect info when click on info button
 * @param custom_tracking
 */
export function RedirectInfo(custom_tracking: string)
{
    if ((<any>window).CC_DEBUG || (<any>window).REVIEW)
    {
        window.open('https://ingameads.gameloft.com/ads/adserver/ad_targeting_info.php?lang=en&data=%7B%22game%22%3A%22DAMA%22%2C%22device%22%3Atrue%7D');
    }
    else
    {
        (<any>window).targetingInfoUrl = (<any>window).targetingInfoUrl.startsWith('link:') ? (<any>window).targetingInfoUrl : 'link:' + (<any>window).targetingInfoUrl;
        if ((<any>window).mraid)
        {
            (<any>window).targetingInfoUrl = (<any>window).targetingInfoUrl.replace('link:', '');
        }

        TrackingManager.SendEventTracking(TrackingAction.CLICK_INFO, () =>
        {
            (<any>window).redirect((<any>window).targetingInfoUrl);
        }, custom_tracking);
    }
}

/**
 * Send tracking and exit the game
 * @param customTrackingData
 */
export function SendTrackingAndExit(customTrackingData: string = "N/A")
{
    const ExitGame = () =>
    {
        if (typeof (<any>window).mraid == 'undefined')
        {
            if ((<any>window).REVIEW)
            {
                // BANNER.Show();
                // iView.setBanner(true);
            }
            else
            {
                (<any>window).redirect("exit:");
            }
        }
        else
        {
            if (typeof (<any>window).reward_currency !== 'undefined' && ((<any>window).creative_type_id != '18'))// mraid incentivized
            {
                (<any>window).mraid.closeWithReward((<any>window).reward_currency, true);
            }
            else
            {
                (<any>window).mraid.close();
            }
        }
    }

    TrackingManager.SendEventTracking(TrackingAction.CLOSE, ExitGame, customTrackingData);
    if (!(<any>window).REVIEW)
    {
        setTimeout(ExitGame, 1500);
    }
}

/**
 * Handle interrupt on Outfit7
 */
export function RegisterVisibilityChange()
{
    if ((<any>window).isOutfit7)
    {

        let hidden: string
        let visibilityChange: string;

        // Opera 12.10 and Firefox 18 and later support
        if (typeof document.hidden !== "undefined")
        {
            hidden = "hidden";
            visibilityChange = "visibilitychange";
        }
        else if (typeof (<any>document).msHidden !== "undefined")
        {
            hidden = "msHidden";
            visibilityChange = "msvisibilitychange";
        }
        else if (typeof (<any>document).webkitHidden !== "undefined")
        {
            hidden = "webkitHidden";
            visibilityChange = "webkitvisibilitychange";
        }

        function handleVisibilityChange()
        {
            if ((<any>document)[hidden])
            {
                (<any>window).onGamePause();
            }
            else
            {
                (<any>window).onGameResume();
            }
        }

        // Warn if the browser doesn't support addEventListener or the Page Visibility API
        if (typeof document.addEventListener === "undefined" || hidden === undefined)
        {
            console.log("This demo requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.");
        }
        else
        {
            // Handle page visibility change
            document.addEventListener(visibilityChange, handleVisibilityChange, false);
        }
    }
}

/**
 * Dispatch event
 * @param eventName
 */
export function DispatchEvent(eventName: string)
{
    let evt;
    try
    {
        evt = new Event(eventName);
    }
    catch (e)
    {
        evt = document.createEvent('Event');
        evt.initEvent(eventName, true, true);
    }
    document.dispatchEvent(evt);
}

/**
 * Add debug log to screen
 * @param value
 */
export function AddLogText(value: string)
{
    let mainWindow = (<any>window);
    if (mainWindow.mMainDivLogText == undefined)
    {
        let logStyle = document.createElement('style');
        logStyle.innerText = `
            .main_div_log_text{width: 100%; height: 100%; position: fixed; top: 0; left: 0; z-index: 99999; pointer-events: none; text-align: left; overflow: hidden; margin: 0; padding: 0;}
            .main_div_log_text div{width: 100%; height: 100%; padding: 0; margin: 0; text-align: left; overflow-x: hidden; overflow-y: auto; pointer-events: none;}
            .main_div_log_text div p{display: inline; margin: 0; padding: 0; font-family: 'Arial'; color: #00ff00; background-color: rgba(0, 0, 0, 0.3); font-size: 2vmax;}
        `;

        mainWindow.mMainDivLogText = document.createElement('div');
        mainWindow.mMainDivLogText.classList.add('main_div_log_text');
        mainWindow.mDivLogText = document.createElement('div');
        document.head.appendChild(logStyle);
        document.body.appendChild(mainWindow.mMainDivLogText);
        mainWindow.mMainDivLogText.appendChild(mainWindow.mDivLogText);
    }

    let newP = document.createElement('p');
    newP.innerText = '' + value;
    newP.appendChild(document.createElement('br'));

    mainWindow.mDivLogText.appendChild(newP);
    mainWindow.mDivLogText.scrollTop = mainWindow.mDivLogText.scrollHeight;

    while (mainWindow.mDivLogText.childNodes.length > 2 && mainWindow.mDivLogText.lastChild.offsetTop >= 0.95 * mainWindow.mDivLogText.getBoundingClientRect().height)
    {
        mainWindow.mDivLogText.removeChild(mainWindow.mDivLogText.firstChild);
    }
}
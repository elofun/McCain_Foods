import { Enum } from "cc";

export class Profiles
{
    finishTutorial: boolean = true;
}

export class Config
{
    static REST_API_SERVER = "https://oms.gameloft.com"
    static profiles: Profiles = new Profiles();

    static isSupportTwoScreenSize: boolean = false;
    static gameDuration = 30;
    static gameDuration_outfit7 = 25;
}

export enum EventType
{
    INGAME = "ingame",
    RESULT = "result",
    POPUP_TUTORIAL = "popup_tutorial",
    POPUP_EXIT = "popup_exit",
    POPUP_NO_REWARD = "popup_no_reward",
    SYSTEM = "system",
}

export enum ActionIngame
{
    TIMEOUT,
    EXIT,
    BACK_PRESS,
}

export enum ActionResult
{
    RETRY,
    EXIT,
    GOT_REWARD
}

export enum ActionPopupExit
{
    YES,
    NO
}

export enum ActionPopupTutorial
{
    SHOW,
    HIDE
}

export enum ActionPopupNoReward
{
    SHOW,
    HIDE
}

export enum ActionSystem
{
    PAUSE,
    RESUME,
    BACK
}

export enum EffectType
{
    NONE,
    BOOST,
    PLUS_10,
    MINUS_5,
    TEXT_GO,
    TEXT_TIME_UP
}


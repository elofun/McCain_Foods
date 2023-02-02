import Resource from "./Resource";

(<any>window).QTE_number = 0;

export enum TrackingAction {
    IMPRESSIONS = 210628, // ad is displayed.
    TYPE_PLAYER_EXPAND = 224025, // When the user expand the video player(like on VWRAP/Buddy Pack/(3R))
    TYPE_PLAYER_COLLAPSE = 224026, // When the user un-expand the video player (like on VWRAP/Buddy pack(3R))
    ADS_EXPAND = 211307, // user click on the banner
    ADS_COLLAPSE = 218749, // user collapse the ads back to banner
    ENGAGEMENTS = 218009, // MIG starts (user click on the play button)
    ENDGAMENTS_LOADING_COMPLETE = 238558, // This action is called right before the AP is displayed completely to users.
    CONFIRMED_ENGAGEMENTS = 191963, // User click on the tap to continue button
    TYPE_FIRST_QUARTILE = 224028, // When video reaches 25% of its total.
    TYPE_MIDPOINT = 224029, // When video reaches 50% of its total.
    TYPE_THIRD_QUARTILE = 224030, // When video reaches 75% of its total.
    TYPE_END_QUARTILE = 234554, // When video reaches 100% of its total.
    COMPLETE_ENGAGEMENTS = 191968, // MIG fully completed
    FIRST_COMPLETE_ENGAGEMENTS = 289812, // Number of times the video played to its completion (ie 100%). Counted only once, meaning if an user replays the video, it is not counted again.
    REPLAY = 191964, // user tap on replay button
    TYPE_REPLAY_VIDEO = 234555, // When the user taps on a "replay" video button
    TYPE_VIDEO_STARTED = 228364, // When the video loaded & played
    CLICK_THROUGHTS = 191967, // when user already click on a link in the ad (browser was opened)
    CLICK_THROUGHTS_START = 328898, // when user start to click on a link in the ad (if available)
    CLOSE = 191969, // when user tap on close button before complete MIG. If user have fully completed the MIG, this event will not be triggered.
    CLICK_ON_SHARE = 201586, // when user tap on the share button (if available)
    CLICK_TO_CALL = 216624, // when user tap on call button (if available)
    FORM_IMPRESSION = 237213, // when form display
    FORM_LEAD = 221840, // when submit form successfully
    FACEBOOK_CLICK_SHARE = 235566, // User clicks on the FB SHARE button
    FACEBOOK_SHARE_FAIL = 235568, // User clicks on the FB SHARE button and fails to share the post to his Facebook wall
    FACEBOOK_SHARE_SUCCESS = 235567, // User clicks on the FB SHARE button and successfully share the post to his Facebook wall
    VK_CLICK_SHARE = 280857, // User clicks on the VK SHARE button
    VK_SHARE_FAIL = 280869, // User clicks on the VK SHARE button and fails to share the post to his VKontakte wall
    VK_SHARE_SUCCESS = 280858, // User clicks on the VK SHARE button and successfully share the post to his VKontakte wall
    VK_CLICK_LOGOUT = 280870, // User clicks on the VK LOGOUT button
    AD_LOADED = 276761, // The ad unit has been loaded -> time_spent_loading: calculate loading times in millisecnd.
    AD_PAUSED = 276762, // Ads pauses because of interrupt,
    AD_PLAYING = 276763, // Ads resumed after interrupt.
    LEADERBOARD_IMPRESSION = 310924, // Click to Leaderboard
    TYPE_QTE_SUCCESSFUL = 253201, // The player successfully pass the QTE
    TYPE_QTE_FAILED = 253202, // The player fails the QTE
    AGREED_VIEW = 241229, // User watched video with an accepted amount of time
    TYPE_PAGE_VISITED = 223611, // When user change page: using 'page' param (custom_tracking of collection will be for the products)
    SAVE_SCREENSHOT = 286351, // When user save a screenshot/pucture. The custom_tracking contains the background ID which is used.
    TYPE_TWITTER_CLICK_SHARE = 280159, // when user tap on the share button (if available)
    CLICK_INFO = 343224, // when user tap on the info button
    DECLINE_CALL = 285722, // when user decline the call
    END_CALL = 285723, // when user endcall
    AD_VIEWABLE = 362818, // Calculate the ads loading times from black screen to fully display
    TYPE_PAGE_IMPRESSION = 381397, // Detecting if users enter any page. The "page" parameter will return the name of the page.
    CLICK_ON_BUTTON = 384856, // Detecting if users enter any page. The "page" parameter will return the name of the page.
    REWARD_RECEIVED = 361338, // When user received reward from server. The custom_tracking is the code from server if available.
    FACEBOOK_LOGIN = 332475, // When user login to Facebook.
    FACEBOOK_LOGIN_SUCCESS = 332476, // When user login to Facebook successful.
    UNLOCK = 332477, //When user unlock something.
    UNLOCK_SUCCESS = 332478, //When user unlock something successful
    TUTORIAL_INTERACTION = 382835, //Tracks the progress made during tutorial phase, 'custom_tracking': name of tutorial step.
}

export enum TrackingFormat {
    MIG = 200116,
    HYBRID = 234553,
    MINT_MIG = 226759,
    BLS = 363611,
    VIDEO_FORM = 316786,
    VHERO = 5,
    VINT = 226760,
    SITE = 222996,
    VBAN = 8,
    VSCORE = 327869,
    FAKE_CALL = 285721,
    VSTORY = 327870,
    FAKE_CALL_VIDEO = 363616,
    FORM_INTERACTIONS = 226757,
    WELCOME_SCREEN = 301759,
    STANDALONE_WEBSITE = 15,
    VINTER_MULTI = 234548,
    INTERACTIVE_VIDEO_SWITCH = 363608,
}

class TrackingMgr {
    apiUrl: string = '';
    token: number = 1;
    score: number = 0;
    page: number = 1;
    timeSpentOnPage: number = 0;
    startLoadingTime: number = 0;
    format: TrackingFormat = TrackingFormat.MINT_MIG;
    evTrack: any =
        {
            210628: { //IMPRESSIONS
                send_one: true,
                count: 0
            },
            224025: { //TYPE_PLAYER_EXPAND
                send_one: false,
                count: 0
            },
            224026: { //TYPE_PLAYER_COLLAPSE
                send_one: false,
                count: 0
            },
            211307: { //ADS_EXPAND
                send_one: true,
                count: 0
            },
            218749: { //ADS_COLLAPSE
                send_one: true,
                count: 0
            },
            218009: { //ENGAGEMENTS
                send_one: true,
                count: 0
            },
            191963: { //CONFIRMED_ENGAGEMENTS
                send_one: true,
                count: 0
            },
            224028: { //TYPE_FIRST_QUARTILE
                send_one: true,
                count: 0
            },
            224029: { //TYPE_MIDPOINT
                send_one: true,
                count: 0
            },
            224030: { //TYPE_THIRD_QUARTILE
                send_one: true,
                count: 0
            },
            234554: { //TYPE_END_QUARTILE
                send_one: true,
                count: 0
            },
            191968: { //COMPLETE_ENGAGEMENTS
                send_one: false,
                send_score: true,
                send_time_spent: true,
                count: 0
            },
            191964: { //REPLAY
                send_one: false,
                count: 0
            },
            234555: { //REPLAY_VIDEO
                send_one: false,
                count: 0
            },
            228364: { //TYPE_VIDEO_STARTED
                send_one: false,
                count: 0
            },
            191967: { //CLICK_THROUGHTS
                send_one: false,
                count: 0
            },
            328898: { //CLICK_THROUGHTS_START
                send_one: false,
                count: 0
            },
            191969: { //CLOSE
                send_one: true,
                count: 0
            },
            201586: { //CLICK_ON_SHARE
                send_one: false,
                count: 0
            },
            216624: { //CLICK_TO_CALL
                send_one: false,
                count: 0
            },
            237213: { //FORM_IMPRESSION
                send_one: false,
                count: 0
            },
            221840: { //FORM_LEAD
                send_one: false,
                count: 0
            },
            235566: { //FACEBOOK_CLICK_SHARE
                send_one: false,
                count: 0
            },
            235568: { //FACEBOOK_SHARE_FAIL
                send_one: false,
                count: 0
            },
            235567: { //FACEBOOK_SHARE_SUCCESS
                send_one: false,
                count: 0
            },
            280857: { //VK_CLICK_SHARE
                send_one: false,
                count: 0
            },
            280869: { //VK_SHARE_FAIL
                send_one: false,
                count: 0
            },
            280858: { //VK_SHARE_SUCCESS
                send_one: false,
                count: 0
            },
            280870: { //VK_CLICK_LOGOUT
                send_one: false,
                count: 0
            },
            238558: { //ENDGAMENTS_LOADING_COMPLETE
                send_one: true,
                count: 0
            },
            289812: { //FIRST_COMPLETE_ENGAGEMENTS
                send_one: true,
                count: 0
            },
            286351: { //SAVE_SCREENSHOT
                send_one: false,
                send_score: true,
                count: 0
            },
            276761: { //AD_LOADED
                send_one: true,
                count: 0
            },
            276762: { //AD_PAUSED
                send_one: false,
                count: 0
            },
            276763: { //AD_PLAYING
                send_one: false,
                count: 0
            },
            310924: { //LEADERBOARD_IMPRESSION
                send_one: false,
                count: 0
            },
            253201: { //TYPE_QTE_SUCCESSFUL
                send_one: false,
                count: 0
            },
            253202: { //TYPE_QTE_FAILED
                send_one: false,
                count: 0
            },
            241229: {//AGREED_VIEW
                send_one: true,
                count: 0
            },
            381397: {//TYPE_PAGE_IMPRESSION
                send_one: false,
                send_page: true,
                count: 0
            },
            223611: { //TYPE_PAGE_VISITED
                send_one: false,
                send_page: true,
                count: 0
            },
            280159: { //TYPE_TWITTER_CLICK_SHARE
                send_one: false,
                count: 0
            },
            343224: { //CLICK_INFO
                send_one: false,
                count: 0
            },
            332475: { //FACEBOOK_LOGIN
                send_one: true,
                count: 0
            },
            332476: { //FACEBOOK_LOGIN_SUCCESS
                send_one: true,
                count: 0
            },
            332477: { //UNLOCK
                send_one: false,
                count: 0
            },
            332478: { //UNLOCK_SUCCESS
                send_one: false,
                count: 0
            },
            285722: { //DECLINE_CALL
                send_one: true,
                count: 0
            },
            285723: { //END_CALL
                send_one: true,
                count: 0
            },
            362818: { //AD_VIEWABLE
                send_one: true,
                count: 0
            },
            382835: { //TUTORIAL_INTERACTION
                send_one: false,
                count: 0
            },
            384856: { //CLICK_ON_BUTTON
                send_one: false,
                count: 0
            },
            361338: { //REWARD_RECEIVED
                send_one: false,
                count: 0
            }
        };

    constructor() {
        this.SaveStatsOld();

        (<any>window).anonymous = (<any>window).anonymous === "ANONYMOUS_ACCOUNT" ? "" : (<any>window).anonymous;
        Resource.args["anonymous"] = Resource.args["anonymous"] === "ANONYMOUS_ACCOUNT" ? "" : Resource.args["anonymous"];
        Resource.args["fbid"] = Resource.args["fbid"] === "FACEBOOK_ID" ? "" : Resource.args["fbid"];
        Resource.args["gliveusername"] = Resource.args["gliveusername"] === "GLIVE_USERNAME" ? "" : Resource.args["gliveusername"];
        Resource.args["gcid"] = Resource.args["gcid"] === "GAMECENTER_UID" ? "" : Resource.args["gcid"];
        (<any>window).anonymous = (<any>window).anonymous || Resource.args["anonymous"] || Resource.args["fbid"] || Resource.args["gliveusername"] || Resource.args["gcid"] || Resource.args["hdidfv"] || Resource.args["udid"];

        if (typeof ((<any>window).anonymous) != 'undefined' && (<any>window).anonymous != null) {
            if ((<any>window).anonymous.indexOf("anonymous") == -1
                && (<any>window).anonymous.indexOf("iphone") == -1
                && (<any>window).anonymous.indexOf("android") == -1
                && (<any>window).anonymous.indexOf("google") == -1) {
                (<any>window).anonymous = "anonymous:" + (<any>window).anonymous;
            }
        }

        if (this.IsTrackingBeta()) {
            this.apiUrl = `https://etsv2-beta.gameloft.com/gs_web?ggi={ggi}`;
        }
        else {
            this.apiUrl = `https://etsv2.gameloft.com/gs_web?ggi={ggi}`;
        }
    }

    IsTrackingBeta() {
        return (!(<any>window).omsPhase || (<any>window).omsPhase == 'dev' || (<any>window).omsPhase == 'qa');
    }

    IsIVPointcut() {
        return (<any>window).iv_location_type == '1';
    }

    SaveStatsOld() {
        //NMH override to send redirect tracking at same page
        if (!(<any>window).saveStatsOld) {
            let saveStatsOld = (<any>window).saveStats;
            (<any>window).saveStats = (query: any, urlRedirect: string) => {
                if (urlRedirect) {
                    let track = (<any>window).strStatsUrl + query;
                    let redir = urlRedirect.replace(/link:/i, "");
                    let payload = { track: track, redir: redir, ets: '' };
                    if ((<any>window).ets_redirect_data) {
                        payload["ets"] = (<any>window).ets_redirect_data;
                    }

                    let trackingPortal = "https://game-portal.gameloft.com/2093/redirect.php?track_redir=base64";
                    if (this.IsTrackingBeta()) {
                        trackingPortal = "https://game-portal.gameloft.com/2093/redirect_beta.php?track_redir=base64";
                    }
                    let link = ((typeof (<any>window).mraid === 'undefined') ? "link:" : "") + trackingPortal + (<any>window).btoa(JSON.stringify(payload));
                    if ((<any>window).redirect) {
                        (<any>window).redirect(link);
                    }
                    else if ((<any>window).REVIEW) {
                        (<any>window).open(link.replace("link:", ""), "_blank");
                    }
                }
                else {
                    return saveStatsOld(query, urlRedirect);
                }
            };
        }
    }

    SetFormat(format: TrackingFormat) {
        this.format = format;
    }

    SetScoreParam(score: number) {
        this.score = score;
    }

    SetPageInfo(page: number, timeSpent: number) {
        this.page = page;
        this.timeSpentOnPage = timeSpent;
    }

    SetPixelTracking(action: TrackingAction, url: string) {
        if (this.evTrack[action]) {
            this.evTrack[action].pixel_tracking = url;
        }
    }

    GetSourceGameGGI() {
        if (!(<any>window).isOutfit7) {
            let hostGameGGI = Resource.args["ggi"];
            if (typeof hostGameGGI === 'undefined') {
                let hostgame_clientid = decodeURIComponent((<any>window).client_id || Resource.args["clientid"] || "");
                let clientid_parts = hostgame_clientid.split(":");
                if (clientid_parts.length >= 4) {
                    hostGameGGI = isNaN(parseInt(clientid_parts[0])) ? clientid_parts[2] : clientid_parts[1];
                }
            }
            return parseInt(hostGameGGI);
        }
        else {
            return 0;
        }
    }

    SendEventTracking(actions: any, callback: any = null, custom_tracking: string = "N/A", redirect_url: string = null) {
        if (((<any>window).DEBUG || !(<any>window).campaign_id || !(<any>window).creative_id || !(<any>window).anonymous) && (typeof (<any>window).mraid === 'undefined') && !(<any>window).VPaid) {
            if (callback != null) {
                callback(false);
            }
            return false;
        }

        if (!(actions instanceof Array)) {
            actions = [actions];
        }

        let trackdata = {
            ggi: parseInt(Resource.GetParam("tracking_ggi")),
            entity_type: (<any>window).omsPhase === "gold" ? "GAMELOFT_MINIGAME_GOLD" : "GAMELOFT_MINIGAME_BETA",
            entity_id: `3402:${Resource.GetParam("tracking_ggi")}:${(<any>window).omsVersion}:HTML5:Ads`,
            proto_ver: `${(<any>window).omsVersion}`,
            ts: 0,
            uuid: '',
            events: [] as any
        };

        actions.forEach((action: TrackingAction) => {
            if (this.evTrack[action]) {
                if (this.evTrack[action].send_one && this.evTrack[action].count > 0) {
                    if (callback != null) {
                        callback(false);
                    }
                    return false;
                }
                this.evTrack[action].count++;
            }

            if (action === TrackingAction.CLOSE) {
                if (custom_tracking == "N/A") {
                    if (this.format == TrackingFormat.MIG || this.format == TrackingFormat.VHERO ||
                        this.format == TrackingFormat.FAKE_CALL || this.format == TrackingFormat.FAKE_CALL_VIDEO ||
                        this.format == TrackingFormat.HYBRID || this.format == TrackingFormat.WELCOME_SCREEN ||
                        this.format == TrackingFormat.INTERACTIVE_VIDEO_SWITCH) {
                        if (this.evTrack[TrackingAction.COMPLETE_ENGAGEMENTS].count == 0) {
                            custom_tracking = "before_completed_engagement";
                        }
                    }
                    else if (this.format == TrackingFormat.VIDEO_FORM) {
                        if (this.evTrack[TrackingAction.TYPE_END_QUARTILE].count == 0) {
                            custom_tracking = "before_ad_video_complete";
                        }
                    }
                    else if (this.format == TrackingFormat.SITE) {
                        if (this.evTrack[TrackingAction.TYPE_END_QUARTILE].count == 0) {
                            custom_tracking = "before_completed_engagement";
                        }
                    }
                }

                if (this.format == TrackingFormat.VSCORE) {
                    if (this.evTrack[TrackingAction.COMPLETE_ENGAGEMENTS].count > 0) {
                        if (callback != null) {
                            callback(false); //Don't send CLOSE event if user have to complete engagement
                        }
                        return false;
                    }
                }
            }

            let loading_time = 0;
            if (action === TrackingAction.IMPRESSIONS || action === TrackingAction.AD_LOADED || action === TrackingAction.AD_VIEWABLE) {
                if ((<any>window).startTime) {
                    loading_time = (new Date()).getTime() - (<any>window).startTime;
                }
            }
            else if (action === TrackingAction.ENGAGEMENTS) {
                this.startLoadingTime = (<any>window).gTotalTimeSpent;
            }
            else if (action === TrackingAction.ENDGAMENTS_LOADING_COMPLETE || action === TrackingAction.TYPE_VIDEO_STARTED) {
                loading_time = Math.ceil(((<any>window).gLoadingTimeSpent > 0 ? (<any>window).gLoadingTimeSpent : (<any>window).gTotalTimeSpent) * 1000);
            }

            if (this.format == TrackingFormat.MIG) {
                trackdata.events.push({
                    gdid: 0,
                    type: this.format,
                    token: this.token++,
                    data: {
                        action_type: action,
                        ad: Resource.args["ad"] || "N/A",
                        anon_id: decodeURIComponent((<any>window).anonymous) || "",
                        campaign_id: (<any>window).campaign_id || "",
                        creative_id: (<any>window).creative_id || "",
                        custom_tracking: custom_tracking || "N/A",
                        d_country: (<any>window).deviceCountry || "",
                        ip_country: (<any>window).ipCountry || "",
                        score: this.evTrack[action].send_score ? this.score : 0,
                        source_game: this.GetSourceGameGGI() || 0,
                        game_igp_code: (<any>window).game_igp_code || "N/A",
                        time_spent_loading: (action === TrackingAction.IMPRESSIONS) ? 0 : loading_time,
                        total_time_spent_ads: Math.ceil((<any>window).gTotalTimeSpent || 0),
                        total_time_spent_playing: this.evTrack[action].send_time_spent ? Math.ceil((<any>window).gIngameTimeSpent || 0) : 0,
                        ver: `${(<any>window).omsVersion}`,
                        iv_location_type: this.IsIVPointcut() ? 'IV' : 'non-IV',
                        rim_pointcut_id: Resource.args["location"] || "N/A"
                    }
                });
            }
            else if (this.format == TrackingFormat.STANDALONE_WEBSITE) {
                trackdata.events.push({
                    gdid: 0,
                    type: this.format,
                    token: this.token++,
                    data: {
                        action_type: action,
                        ad_type: Resource.args["ad"] || "N/A",
                        anon_id: decodeURIComponent((<any>window).anonymous) || "",
                        content: (<any>window).tracking_content || "N/A",
                        campaign_id: (<any>window).campaign_id || "",
                        creative_id: (<any>window).creative_id || "",
                        custom_tracking: custom_tracking || "N/A",
                        d_country: (<any>window).deviceCountry || "",
                        ip_country: (<any>window).ipCountry || "",
                        score: this.evTrack[action].send_score ? this.score : 0,
                        time_spent_loading: (action === TrackingAction.IMPRESSIONS) ? 0 : loading_time,
                        total_time_spent_ads: Math.ceil((<any>window).gTotalTimeSpent || 0),
                        total_time_spent_playing: this.evTrack[action].send_time_spent ? Math.ceil((<any>window).gIngameTimeSpent || 0) : 0,
                        ver: `${(<any>window).omsVersion}`
                    }
                });
            }
            else if (this.format == TrackingFormat.HYBRID) {
                trackdata.events.push({
                    gdid: 0,
                    type: this.format,
                    token: this.token++,
                    data: {
                        action_type: action,
                        ad: Resource.args["ad"] || "N/A",
                        anon_id: decodeURIComponent((<any>window).anonymous) || "",
                        campaign_id: (<any>window).campaign_id || "",
                        creative_id: (<any>window).creative_id || "",
                        custom_tracking: custom_tracking || "N/A",
                        d_country: (<any>window).deviceCountry || "",
                        ip_country: (<any>window).ipCountry || "",
                        score: this.evTrack[action].send_score ? this.score : 0,
                        source_game: this.GetSourceGameGGI() || 0,
                        game_igp_code: (<any>window).game_igp_code || "N/A",
                        iv_location_type: this.IsIVPointcut() ? 'IV' : 'non-IV',
                        rim_pointcut_id: Resource.args["location"] || "N/A",
                        time_spent_loading: (action === TrackingAction.IMPRESSIONS) ? 0 : loading_time,
                        total_time_spent_ads: Math.ceil((<any>window).gTotalTimeSpent || 0),
                        total_time_spent_playing: this.evTrack[action].send_time_spent ? Math.ceil((<any>window).gIngameTimeSpent || 0) : 0,
                        ver: `${(<any>window).omsVersion}`
                    }
                });
            }
            else if (this.format == TrackingFormat.SITE) {
                trackdata.events.push({
                    gdid: 0,
                    type: this.format,
                    token: this.token++,
                    data: {
                        action_type: action,
                        ad: Resource.args["ad"] || "",
                        anon_id: decodeURIComponent((<any>window).anonymous) || "",
                        campaign_id: (<any>window).campaign_id || "",
                        creative_id: (<any>window).creative_id || "",
                        custom_tracking: custom_tracking || "N/A",
                        custom_tracking_video_position: 0,
                        d_country: (<any>window).deviceCountry || "",
                        ip_country: (<any>window).ipCountry || "",
                        page: this.evTrack[action].send_page ? ("Page_" + this.page) : "N/A",
                        iv_location_type: this.IsIVPointcut() ? 'IV' : 'non-IV',
                        rim_pointcut_id: Resource.args["location"] || "N/A",
                        source_game: this.GetSourceGameGGI() || 0,
                        game_igp_code: (<any>window).game_igp_code || "N/A",
                        time_spent_loading: (action === TrackingAction.ENDGAMENTS_LOADING_COMPLETE) ? Math.ceil(((<any>window).gTotalTimeSpent - this.startLoadingTime) * 1000) : loading_time,
                        total_time_spent_ads: Math.ceil((<any>window).gTotalTimeSpent || 0),
                        total_time_spent_on_page: this.evTrack[action].send_page ? Math.ceil(this.timeSpentOnPage) : 0,
                        ver: `${(<any>window).omsVersion}`
                    }
                });
            }
            else if (this.format == TrackingFormat.MINT_MIG) {
                let qte_number = ((action === TrackingAction.TYPE_QTE_SUCCESSFUL) || (action === TrackingAction.TYPE_QTE_FAILED) || (action === TrackingAction.ENGAGEMENTS)) ? (<any>window).QTE_number : 0;
                let video_position = 0;
                if (custom_tracking.indexOf('video_position') != -1) {
                    video_position = +custom_tracking.split(':')[1];
                    custom_tracking = "N/A";
                }
                trackdata.events.push({
                    gdid: 0,
                    type: this.format,
                    token: this.token++,
                    data: {
                        action_type: action,
                        ad: Resource.args["ad"] || "",
                        anon_id: decodeURIComponent((<any>window).anonymous) || "",
                        campaign_id: (<any>window).campaign_id || "",
                        creative_id: (<any>window).creative_id || "",
                        custom_tracking: custom_tracking || "N/A",
                        custom_tracking_video_position: video_position,
                        d_country: (<any>window).deviceCountry || "",
                        ip_country: (<any>window).ipCountry || "",
                        qte_number: qte_number,
                        source_game: this.GetSourceGameGGI() || 0,
                        game_igp_code: (<any>window).game_igp_code || "N/A",
                        time_spent_loading: (action === TrackingAction.AD_LOADED || action === TrackingAction.TYPE_VIDEO_STARTED || action === TrackingAction.AD_VIEWABLE) ? loading_time : 0,
                        total_time_spent_ads: Math.ceil((<any>window).gTotalTimeSpent || 0),
                        ver: `${(<any>window).omsVersion}`,
                        iv_location_type: this.IsIVPointcut() ? 'IV' : 'non-IV',
                        rim_pointcut_id: Resource.args["location"] || "N/A"
                    }
                });
            }
            else if (this.format == TrackingFormat.BLS) {
                trackdata.events.push({
                    gdid: 0,
                    type: this.format,
                    token: this.token++,
                    data: {
                        action_type: action,
                        ad: Resource.args["ad"] || "",
                        anon_id: decodeURIComponent((<any>window).anonymous) || "",
                        campaign_id: (<any>window).campaign_id || "",
                        creative_id: (<any>window).creative_id || "",
                        custom_tracking: custom_tracking || "N/A",
                        d_country: (<any>window).deviceCountry || "",
                        ip_country: (<any>window).ipCountry || "",
                        source_game: this.GetSourceGameGGI() || 0,
                        game_igp_code: (<any>window).game_igp_code || "N/A",
                        time_spent_loading: (action === TrackingAction.IMPRESSIONS) ? 0 : loading_time,
                        total_time_spent_ads: Math.ceil((<any>window).gTotalTimeSpent || 0),
                        ver: `${(<any>window).omsVersion}`,
                        iv_location_type: this.IsIVPointcut() ? 'IV' : 'non-IV',
                        rim_pointcut_id: Resource.args["location"] || "N/A"
                    }
                });
            }
            else if (this.format == TrackingFormat.FORM_INTERACTIONS) {
                trackdata.events.push({
                    gdid: 0,
                    type: this.format,
                    token: this.token++,
                    data: {
                        action_type: action,
                        ad: Resource.args["ad"] || "",
                        anon_id: decodeURIComponent((<any>window).anonymous) || "",
                        campaign_id: (<any>window).campaign_id || "",
                        creative_id: (<any>window).creative_id || "",
                        custom_tracking: custom_tracking || "N/A",
                        d_country: (<any>window).deviceCountry || "",
                        ip_country: (<any>window).ipCountry || "",
                        source_game: this.GetSourceGameGGI() || 0,
                        game_igp_code: (<any>window).game_igp_code || "N/A",
                        time_spent_loading: (action === TrackingAction.IMPRESSIONS) ? 0 : loading_time,
                        total_time_spent_ads: Math.ceil((<any>window).gTotalTimeSpent || 0),
                        ver: `${(<any>window).omsVersion}`,
                        iv_location_type: this.IsIVPointcut() ? 'IV' : 'non-IV',
                        rim_pointcut_id: Resource.args["location"] || "N/A"
                    }
                });
            }
            else if (this.format == TrackingFormat.VIDEO_FORM) {
                trackdata.events.push({
                    gdid: 0,
                    type: this.format,
                    token: this.token++,
                    data: {
                        action_type: action,
                        ad: Resource.args["ad"] || "",
                        anon_id: decodeURIComponent((<any>window).anonymous) || "",
                        campaign_id: (<any>window).campaign_id || "",
                        creative_id: (<any>window).creative_id || "",
                        custom_tracking: custom_tracking || "N/A",
                        d_country: (<any>window).deviceCountry || "",
                        ip_country: (<any>window).ipCountry || "",
                        source_game: this.GetSourceGameGGI() || 0,
                        game_igp_code: (<any>window).game_igp_code || "N/A",
                        time_spent_loading: loading_time,
                        total_time_spent_ads: Math.ceil((<any>window).gTotalTimeSpent || 0),
                        ver: `${(<any>window).omsVersion}`,
                        iv_location_type: this.IsIVPointcut() ? 'IV' : 'non-IV',
                        rim_pointcut_id: Resource.args["location"] || "N/A"
                    }
                });
            }
            else if (this.format == TrackingFormat.VHERO) {
                let qte_number = ((action === TrackingAction.TYPE_QTE_SUCCESSFUL) || (action === TrackingAction.TYPE_QTE_FAILED) || (action === TrackingAction.ENGAGEMENTS)) ? (<any>window).QTE_number : 0;
                trackdata.events.push({
                    gdid: 0,
                    type: this.format,
                    token: this.token++,
                    data: {
                        action_type: action,
                        ad: Resource.args["ad"] || "",
                        anon_id: decodeURIComponent((<any>window).anonymous) || "",
                        campaign_id: parseInt((<any>window).campaign_id || 0),
                        creative_id: parseInt((<any>window).creative_id || 0),
                        custom_tracking: custom_tracking || "N/A",
                        d_country: (<any>window).deviceCountry || "",
                        ip_country: (<any>window).ipCountry || "",
                        qte_number: qte_number,
                        source_game: this.GetSourceGameGGI() || 0,
                        game_igp_code: (<any>window).game_igp_code || "N/A",
                        time_spent_loading: (action === TrackingAction.IMPRESSIONS) ? 0 : loading_time,
                        total_time_spent_ads: Math.ceil((<any>window).gTotalTimeSpent || 0),
                        ver: `${(<any>window).omsVersion}`,
                        iv_location_type: this.IsIVPointcut() ? 'IV' : 'non-IV',
                        rim_pointcut_id: Resource.args["location"] || "N/A"
                    }
                });
            }
            else if (this.format == TrackingFormat.VINT) {
                trackdata.events.push({
                    gdid: 0,
                    type: this.format,
                    token: this.token++,
                    data: {
                        action_type: action,
                        ad: Resource.args["ad"] || "",
                        anon_id: decodeURIComponent((<any>window).anonymous) || "",
                        campaign_id: (<any>window).campaign_id || "",
                        creative_id: (<any>window).creative_id || "",
                        custom_tracking: custom_tracking || "N/A",
                        d_country: (<any>window).deviceCountry || "",
                        ip_country: (<any>window).ipCountry || "",
                        iv_location_type: this.IsIVPointcut() ? 'IV' : 'non-IV',
                        rim_pointcut_id: Resource.args["location"] || "N/A",
                        source_game: this.GetSourceGameGGI() || 0,
                        game_igp_code: (<any>window).game_igp_code || "N/A",
                        time_spent_loading: (action === TrackingAction.ENDGAMENTS_LOADING_COMPLETE) ? Math.ceil(((<any>window).gTotalTimeSpent - this.startLoadingTime) * 1000) : loading_time,
                        total_time_spent_ads: Math.ceil((<any>window).gTotalTimeSpent || 0),
                        ver: `${(<any>window).omsVersion}`
                    }
                });
            }
            else if (this.format == TrackingFormat.VBAN) {
                trackdata.events.push({
                    gdid: 0,
                    type: this.format,
                    token: this.token++,
                    data: {
                        action_type: action,
                        ad: Resource.args["ad"] || "",
                        anon_id: decodeURIComponent((<any>window).anonymous) || "",
                        campaign_id: (<any>window).campaign_id || "",
                        creative_id: (<any>window).creative_id || "",
                        custom_tracking: custom_tracking || "N/A",
                        d_country: (<any>window).deviceCountry || "",
                        ip_country: (<any>window).ipCountry || "",
                        iv_location_type: this.IsIVPointcut() ? 'IV' : 'non-IV',
                        rim_pointcut_id: Resource.args["location"] || "N/A",
                        source_game: this.GetSourceGameGGI() || 0,
                        game_igp_code: (<any>window).game_igp_code || "N/A",
                        time_spent_loading: (action === TrackingAction.IMPRESSIONS) ? 0 : loading_time,
                        total_time_spent_ads: ((action === TrackingAction.ADS_EXPAND) && (this.evTrack[action].count == 1)) ? 0 : Math.ceil((<any>window).gTotalTimeSpent || 0),
                        ver: `${(<any>window).omsVersion}`
                    }
                });
            }
            else if (this.format == TrackingFormat.VSCORE) {
                let qte_number = ((action === TrackingAction.TYPE_QTE_SUCCESSFUL) || (action === TrackingAction.TYPE_QTE_FAILED)) ? (<any>window).QTE_number : 0;
                let send_score = (action === TrackingAction.COMPLETE_ENGAGEMENTS) || (action === TrackingAction.FIRST_COMPLETE_ENGAGEMENTS);

                trackdata.events.push({
                    gdid: 0,
                    type: this.format,
                    token: this.token++,
                    data: {
                        action_type: action,
                        ad: Resource.args["ad"] || "",
                        anon_id: decodeURIComponent((<any>window).anonymous) || "",
                        campaign_id: parseInt((<any>window).campaign_id || 0),
                        creative_id: parseInt((<any>window).creative_id || 0),
                        custom_tracking: custom_tracking || "N/A",
                        d_country: (<any>window).deviceCountry || "N/A",
                        ip_country: (<any>window).ipCountry || "N/A",
                        qte_number: qte_number,
                        score: send_score ? this.score : 0,
                        source_game: this.GetSourceGameGGI() || 0,
                        game_igp_code: (<any>window).game_igp_code || "N/A",
                        time_spent_loading: (action === TrackingAction.IMPRESSIONS) ? 0 : loading_time,
                        total_time_spent_ads: Math.ceil((<any>window).gTotalTimeSpent || 0),
                        ver: `${(<any>window).omsVersion}`,
                        iv_location_type: this.IsIVPointcut() ? 'IV' : 'non-IV',
                        rim_pointcut_id: Resource.args["location"] || "N/A"
                    }
                });
            }
            else if (this.format == TrackingFormat.FAKE_CALL || this.format == TrackingFormat.FAKE_CALL_VIDEO) {
                let video_position = 0;
                if (custom_tracking.indexOf('video_position') != -1) {
                    video_position = +custom_tracking.split(':')[1];
                    custom_tracking = "N/A";

                    if (action === TrackingAction.TYPE_VIDEO_STARTED) {
                        loading_time = (<any>window).video_loading_time[video_position - 1];
                    }
                }

                trackdata.events.push({
                    gdid: 0,
                    type: this.format,
                    token: this.token++,
                    data: {
                        action_type: action,
                        ad: Resource.args["ad"] || "",
                        anon_id: decodeURIComponent((<any>window).anonymous) || "",
                        campaign_id: (<any>window).campaign_id || "",
                        creative_id: (<any>window).creative_id || "",
                        custom_tracking: custom_tracking || "N/A",
                        custom_tracking_video_position: video_position || 0,
                        d_country: (<any>window).deviceCountry || "",
                        ip_country: (<any>window).ipCountry || "",
                        iv_location_type: this.IsIVPointcut() ? 'IV' : 'non-IV',
                        rim_pointcut_id: Resource.args["location"] || "N/A",
                        source_game: this.GetSourceGameGGI() || 0,
                        game_igp_code: (<any>window).game_igp_code || "N/A",
                        time_spent_loading: (action === TrackingAction.AD_LOADED || action === TrackingAction.ENDGAMENTS_LOADING_COMPLETE || action === TrackingAction.TYPE_VIDEO_STARTED || action === TrackingAction.AD_VIEWABLE) ? loading_time : 0,
                        total_time_spent_ads: Math.ceil((<any>window).gTotalTimeSpent || 0),
                        ver: `${(<any>window).omsVersion}`
                    }
                });
            }
            else if (this.format == TrackingFormat.VSTORY) {
                let qte_number = ((action === TrackingAction.TYPE_QTE_SUCCESSFUL) || (action === TrackingAction.TYPE_QTE_FAILED) || (action === TrackingAction.ENGAGEMENTS)) ? (<any>window).QTE_number : 0;
                trackdata.events.push({
                    gdid: 0,
                    type: this.format,
                    token: this.token++,
                    data: {
                        action_type: action,
                        ad: Resource.args["ad"] || "",
                        anon_id: decodeURIComponent((<any>window).anonymous) || "",
                        campaign_id: parseInt((<any>window).campaign_id || 0),
                        creative_id: parseInt((<any>window).creative_id || 0),
                        custom_tracking: custom_tracking || "N/A",
                        d_country: (<any>window).deviceCountry || "",
                        ip_country: (<any>window).ipCountry || "",
                        iv_location_type: this.IsIVPointcut() ? 'IV' : 'non-IV',
                        qte_number: qte_number,
                        rim_pointcut_id: Resource.args["location"] || "N/A",
                        source_game: this.GetSourceGameGGI() || 0,
                        game_igp_code: (<any>window).game_igp_code || "N/A",
                        time_spent_loading: (action === TrackingAction.AD_LOADED || action === TrackingAction.TYPE_VIDEO_STARTED || action === TrackingAction.AD_VIEWABLE) ? loading_time : 0,
                        total_time_spent_ads: Math.ceil((<any>window).gTotalTimeSpent || 0),
                        ver: `${(<any>window).omsVersion}`
                    }
                });
            }
            else if (this.format == TrackingFormat.WELCOME_SCREEN) {
                trackdata.events.push({
                    gdid: 0,
                    type: this.format,
                    token: this.token++,
                    data: {
                        action_type: action,
                        ad: Resource.args["ad"] || "N/A",
                        anon_id: decodeURIComponent((<any>window).anonymous) || "",
                        campaign_id: (<any>window).campaign_id || "",
                        creative_id: (<any>window).creative_id || "",
                        custom_tracking: custom_tracking || "N/A",
                        d_country: (<any>window).deviceCountry || "",
                        game_igp_code: (<any>window).game_igp_code || "N/A",
                        ip_country: (<any>window).ipCountry || "",
                        iv_location_type: this.IsIVPointcut() ? 'IV' : 'non-IV',
                        rim_pointcut_id: Resource.args["location"] || "N/A",
                        source_game: this.GetSourceGameGGI() || 0,
                        time_spent_loading: (action === TrackingAction.IMPRESSIONS) ? 0 : loading_time,
                        total_time_spent_ads: Math.ceil((<any>window).gTotalTimeSpent || 0),
                        ver: `${(<any>window).omsVersion}`
                    }
                });
            }
            else if (this.format == TrackingFormat.VINTER_MULTI) {
                let vinter_number = (
                    (action === TrackingAction.TYPE_VIDEO_STARTED) ||
                    (action === TrackingAction.TYPE_REPLAY_VIDEO) ||
                    (action === TrackingAction.TYPE_FIRST_QUARTILE) ||
                    (action === TrackingAction.TYPE_MIDPOINT) ||
                    (action === TrackingAction.TYPE_THIRD_QUARTILE) ||
                    (action === TrackingAction.FIRST_COMPLETE_ENGAGEMENTS) ||
                    (action === TrackingAction.COMPLETE_ENGAGEMENTS) ||
                    (action === TrackingAction.REPLAY)
                ) ? (<any>window).VINTER_number : 0;
                trackdata.events.push({
                    gdid: 0,
                    type: this.format,
                    token: this.token++,
                    data: {
                        action_type: action,
                        ad: Resource.args["ad"] || "N/A",
                        anon_id: decodeURIComponent((<any>window).anonymous) || "",
                        campaign_id: (<any>window).campaign_id || "",
                        creative_id: (<any>window).creative_id || "",
                        custom_tracking: custom_tracking || "N/A",
                        custom_tracking_video_position: vinter_number,
                        d_country: (<any>window).deviceCountry || "",
                        game_igp_code: (<any>window).game_igp_code || "N/A",
                        ip_country: (<any>window).ipCountry || "",
                        iv_location_type: this.IsIVPointcut() ? 'IV' : 'non-IV',
                        rim_pointcut_id: Resource.args["location"] || "N/A",
                        source_game: this.GetSourceGameGGI() || 0,
                        time_spent_loading: (action === TrackingAction.IMPRESSIONS) ? 0 : loading_time,
                        total_time_spent_ads: Math.ceil((<any>window).gTotalTimeSpent || 0),
                        ver: `${(<any>window).omsVersion}`
                    }
                });
            }
            else if (this.format == TrackingFormat.INTERACTIVE_VIDEO_SWITCH) {
                trackdata.events.push({
                    gdid: 0,
                    type: this.format,
                    token: this.token++,
                    data: {
                        action_type: action,
                        ad: Resource.args["ad"] || "N/A",
                        anon_id: decodeURIComponent((<any>window).anonymous) || "",
                        campaign_id: (<any>window).campaign_id || "",
                        creative_id: (<any>window).creative_id || "",
                        custom_tracking: custom_tracking || "N/A",
                        d_country: (<any>window).deviceCountry || "",
                        ip_country: (<any>window).ipCountry || "",
                        score: this.evTrack[action].send_score ? this.score : 0,
                        source_game: this.GetSourceGameGGI() || 0,
                        game_igp_code: (<any>window).game_igp_code || "N/A",
                        time_spent_loading: (action === TrackingAction.IMPRESSIONS) ? 0 : loading_time,
                        total_time_spent_ads: Math.ceil((<any>window).gTotalTimeSpent || 0),
                        total_time_spent_playing: this.evTrack[action].send_time_spent ? Math.ceil((<any>window).gIngameTimeSpent || 0) : 0,
                        ver: `${(<any>window).omsVersion}`,
                        iv_location_type: this.IsIVPointcut() ? 'IV' : 'non-IV',
                        rim_pointcut_id: Resource.args["location"] || "N/A"
                    }
                });
            }

            if (this.evTrack[action].pixel_tracking) {
                let url = this.evTrack[action].pixel_tracking;
                url = url.replace("{[timestamp]}", "[timestamp]");
                url = url.replace("[timestamp]", Date.now());

                let img = new Image();
                img.src = url;
                img.style.width = '0px';
                img.style.height = '0px';
                document.body.appendChild(img);
            }

            this.GLADSSendTracking(action);
        });

        if (this.IsTrackingBeta()) {
            trackdata.events.forEach((event: any) => {
                event["anon_id"] = decodeURIComponent((<any>window).anonymous) || "";
            });
        }

        if (redirect_url != null) {
            if ((<any>window).call_client) {
                if (typeof (<any>window).mraid !== 'undefined' /*|| GameConfig.isUseMraidCallClient*/) {
                    (<any>window).ets_redirect_data = trackdata;
                    (<any>window).call_client((<any>window).creative_id, 'click', redirect_url);
                }
                else {
                    (<any>window).ets_redirect_data = trackdata;
                    (<any>window).call_client((<any>window).creative_id, 'click', 'link:' + redirect_url);
                    if (callback != null) {
                        callback(true);
                    }
                }
            }
            else if ((<any>window).redirect) {
                (<any>window).redirect(redirect_url);
            }
            else {
                (<any>window).open(redirect_url, "_blank");
            }
        }
        else {
            if (trackdata.events.length > 0) {
                let time = Math.floor(Date.now() / 1000);
                trackdata["ts"] = time + (new Date().getTimezoneOffset() * 60);
                trackdata["uuid"] = this.GetUDID();
                trackdata.events.forEach((event: any) => {
                    let evdata = event["data"];

                    event["ts"] = time;
                    evdata["campaign_id"] = parseInt(evdata["campaign_id"]);
                    evdata["creative_id"] = parseInt(evdata["creative_id"]);

                    if (evdata["d_country"] == "") {
                        evdata["d_country"] = "N/A";
                    }

                    if (evdata["ip_country"] == "") {
                        evdata["ip_country"] = "N/A";
                    }
                });
                this.apiUrl = this.apiUrl.replace("{ggi}", trackdata["ggi"].toString());

                let http = this.SendPayload(this.apiUrl, actions, trackdata, callback, false);
                return http;
            }
            return false;
        }
    };

    SendPayload(url: string, actions: any, payload: any, callback: any, isRetry: boolean) {
        let http = new XMLHttpRequest();
        if (!isRetry) {
            http.onload = (e) => {
                if (callback) {
                    callback(true);
                    callback = null;
                }
            };

            http.onerror = (e) => {
                if (callback) {
                    callback(false);
                    callback = null;
                }
                actions.forEach((action: TrackingAction) => {
                    if (this.evTrack[action]) {
                        this.evTrack[action].count--;
                    }
                });
                this.SendPayload(url, actions, payload, callback, true);
            };
        }
        else {
            http.onload = (e) => {
                //retry sucess
                actions.forEach((action: TrackingAction) => {
                    if (this.evTrack[action]) {
                        this.evTrack[action].count++;
                    }
                });
            };

            http.onerror = (e) => {
                //retry fail
                setTimeout(() => {
                    this.SendPayload(url, actions, payload, callback, true);
                }, 1000);
            };
        }

        // timeout callback : 2s
        if (callback) {
            setTimeout(() => {
                if (callback) {
                    callback(false);
                    callback = null;
                }
            }, 2000);
        }

        http.open("POST", url, true);
        http.setRequestHeader("Content-type", "application/json");
        http.send(JSON.stringify(payload));

        return http;
    }

    FormatNum(num: number, min: number = 4) {
        let numString = num.toString(16);
        return `${'0'.repeat(min - numString.length)}${numString}`;
    }

    RandInRange(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    GetUDID() {
        let udid = `
			${this.FormatNum(this.RandInRange(0, 0xffff))}${this.FormatNum(this.RandInRange(0, 0xffff))}-
			${this.FormatNum(this.RandInRange(0, 0xffff))}-
			${this.FormatNum(this.RandInRange(0, 0xffff) | 0x4000)}-
			${this.FormatNum(this.RandInRange(0, 0xffff) | 0x8000)}-
			${this.FormatNum(this.RandInRange(0, 0xffff))}${this.FormatNum(this.RandInRange(0, 0xffff))}${this.FormatNum(this.RandInRange(0, 0xffff))}
        `;

        return udid.replace(/[\t\n\r]/gm, '').trim();
    }

    GLADSSendTracking(action: TrackingAction) {
        switch (action) {
            case TrackingAction.ADS_EXPAND:
                if ((<any>window).notifyAdExpand) (<any>window).notifyAdExpand();
                break;

            case TrackingAction.ADS_COLLAPSE:
                if ((<any>window).notifyAdCollapse) (<any>window).notifyAdCollapse();
                break;

            case TrackingAction.ENGAGEMENTS:
                if ((<any>window).notifyEngagement) (<any>window).notifyEngagement();
                break;

            case TrackingAction.CONFIRMED_ENGAGEMENTS:
                if ((<any>window).notifyConfirmedEngagement) (<any>window).notifyConfirmedEngagement();
                break;

            case TrackingAction.REPLAY:
                if ((<any>window).notifyReplay) (<any>window).notifyReplay();
                break;

            case TrackingAction.CLOSE:
                if ((<any>window).notifyClose) (<any>window).notifyClose();
                break;

            case TrackingAction.TYPE_PLAYER_EXPAND:
                if ((<any>window).notifyPlayerExpand) (<any>window).notifyPlayerExpand();
                break;

            case TrackingAction.TYPE_PLAYER_COLLAPSE:
                if ((<any>window).notifyPlayerCollapse) (<any>window).notifyPlayerCollapse();
                break;
        }
    }
}
export default new TrackingMgr;
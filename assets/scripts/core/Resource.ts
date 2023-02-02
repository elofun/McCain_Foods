import { FedLeaderboard, FedProfile } from "./Federation";

class Resource {
    args: any = {};
    constructor() {
        //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        //--DEBUG DIALOG---------------------------------------------------------------------------------------------------------------------------------------------------------
        //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------

        (function () {
            if ((<any>window).omsPhase !== "gold") {
                document.addEventListener("document_ready", function () {
                    (<any>window)._show_touchzone = !1;

                    var Units = {
                        vw: function (val: any) {
                            return (<any>window).innerWidth * val / 100;
                        },
                        vh: function (val: any) {
                            return (<any>window).innerHeight * val / 100;
                        },
                        vmax: function (val: any) {
                            return Math.max((<any>window).innerHeight, (<any>window).innerWidth) * val / 100;
                        },
                        vmin: function (val: any) {
                            return Math.min((<any>window).innerHeight, (<any>window).innerWidth) * val / 100;
                        }
                    };

                    var ShowInfos = function () {
                        var a = document.createElement("div");
                        a.innerHTML = "<style> .info-close { position: absolute; padding: 5px; cursor: pointer; right: 0px; top: 0px; background-color: red; color: white; border: solid 1px lightcoral; } .info-context {position: absolute;     left: 50%;     top: 50%;     padding: 10px;     padding-top: 30px;     background-color: white;     z-index: 999999999;     border: solid 1px lightslategray;     transform: translate(-50%,-50%);     -webkit-transform: translate(-50%,-50%);     font-size: 11px;     font-family: monospace;} .show-cta { padding: 5px; cursor: pointer; background-color: red; color: white; border: solid 1px lightcoral; margin: 5px; border-radius: 5px; text-align:center; } </style>  ";
                        var e = document.createElement("div");
                        e.innerHTML = "X";
                        e.className = "info-close";
                        a.appendChild(e);
                        var b = document.createElement("div");
                        b.style.color = 'red';
                        b.innerHTML = "MID: " + ((<any>window).omsPID || "N/A") + "</br>";
                        b.innerHTML += "Phase: " + (<any>window).omsPhase + "</br>";
                        b.innerHTML += "Version: " + (<any>window).omsVersion + "</br>";
                        b.innerHTML += "Creative ID: " + ((<any>window).creative_id || "N/A") + "</br>";
                        b.innerHTML += "Campaign ID: " + ((<any>window).campaign_id || "N/A") + "</br>";
                        b.innerHTML += "Anonymous: " + ((<any>window).anonymous || "n/a") + "</br>";
                        b.innerHTML += "FromCache: " + ((<any>window).fromCache || "n/a") + "</br>";
                        a.appendChild(b);
                        var d = document.createElement("div");
                        d.className = "show-cta";
                        d.innerHTML = (<any>window)._show_touchzone ? "Hide touch zones" : "Show touch zones";
                        a.appendChild(d);

                        var clearLB = document.createElement("div");
                        clearLB.className = "show-cta";
                        clearLB.innerHTML = "Clear my LB entry";
                        clearLB.onclick = function () {
                            let fedLeaderboard = new FedLeaderboard();
                            fedLeaderboard.DeleteMyEntry()
                                .then((response: any) => {
                                    alert("Your LB entry was deleted!");
                                })
                                .catch((error: any) => {
                                    alert(error);
                                })
                        };
                        a.appendChild(clearLB);

                        var clearProfile = document.createElement("div");
                        clearProfile.className = "show-cta";
                        clearProfile.innerHTML = "Clear my profile";
                        clearProfile.onclick = function () {
                            let fedProfile = new FedProfile();
                            fedProfile.Save({})
                                .then((response: any) => {
                                    alert("Your profile was deleted!");
                                })
                                .catch((error: any) => {
                                    alert(error);
                                })
                        };
                        a.appendChild(clearProfile);

                        e.onclick = function () {
                            try {
                                document.body.removeChild(a)
                            }
                            catch (b) { }
                        };
                        d.onclick = function (a) {
                            a.preventDefault();
                            (<any>window)._show_touchzone = !(<any>window)._show_touchzone;
                            (<any>window)._show_touchzone ? (<any>window).showTouchZone && setTimeout((<any>window).showTouchZone, 1) : (<any>window).hideTouchZone && setTimeout((<any>window).hideTouchZone, 1);
                            d.innerHTML = (<any>window)._show_touchzone ? "Hide touch zones" : "Show touch zones";
                            return !1
                        };
                        a.className = "info-context";
                        document.body.appendChild(a)
                    },

                        c = !1,
                        start_touch = function (a: any) {
                            c = !1;
                            a = a.touches ? a.touches[0] : a;
                            a.clientX < Units.vw(10) && a.clientY > Units.vh(90) && (c = !0)
                        },
                        end_touch = function (a: any) {
                            a = a.changedTouches ? a.changedTouches[0] : a;
                            c && a.clientX > Units.vw(90) && a.clientY > Units.vh(90) && ShowInfos();
                            c = !1
                        };

                    let canvas = document.getElementById("GameCanvas");
                    canvas.addEventListener("touchstart", start_touch);
                    canvas.addEventListener("touchend", end_touch);
                    canvas.addEventListener("mousedown", start_touch);
                    canvas.addEventListener("mouseup", end_touch);
                });
            }
        })();

        //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------

        if ((<any>window).strStatsUrl) {
            let params = decodeURI(((<any>window).strStatsUrl || '').split('?').pop()).split('&');
            params.forEach(param => {
                let data = param.split('=');
                this.args[data[0]] = decodeURIComponent(data[1]);
            });
        }
    }

    //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    GetParam(key: string) {
        if ((<any>window).omsPublish) {
            return (<any>window).omsParams[key];
        }
        return key;
    }

    Request(method: string, url: string, body: string = null, responseType: XMLHttpRequestResponseType = null) {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.open(method, url, true);

            if (method == 'post') {
                xhr.setRequestHeader("Content-type", "application/json");
            }

            if (responseType) {
                xhr.responseType = responseType;
            }

            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(xhr.response);
                    }
                    else {
                        reject("error");
                    }
                }
            }
            xhr.send(body);
        })
    }
}
export default new Resource;
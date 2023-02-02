import { sys } from "cc";
import { Config } from "../Defines";
import Resource from "./Resource";

export class FedProfile
{
    pid: number = (<any>window).omsPID || '255';
    userid: string = Resource.args["gl_device_id"] || Resource.args["idfa"] || Resource.args["hdidfv"] || "window";
    phase: string = (<any>window).omsPhase || 'dev';
    name: string = `${this.pid}.${this.userid}`;

    //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    Load()
    {
        return Resource.Request('get', `${Config.REST_API_SERVER}/api/pub/federation/profile/${this.name}/${this.phase}`, null);
    }

    //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    Save(data: any)
    {
        return Resource.Request('post', `${Config.REST_API_SERVER}/api/pub/federation/profile/${this.name}/${this.phase}`, JSON.stringify(data));
    }
}

export class FedLeaderboard
{
    pid: number = (<any>window).omsPID || '255';
    userid: string = Resource.args["gl_device_id"] || Resource.args["idfa"] || Resource.args["hdidfv"] || "window";
    phase: string = (<any>window).omsPhase || 'dev';
    name = 'default';

    //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    Get(offset: number = 0, limit: number = 50)
    {
        return Resource.Request('get', `${Config.REST_API_SERVER}/api/pub/federation/leaderboard/${this.pid}_${this.phase}_${this.name}/${offset}/${limit}`);
    }

    //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    Post(score: number, name: string, attrs: Object = {})
    {
        let body = {
            userid: this.userid,
            score: score,
            name: name,
            attrs: attrs
        }
        return Resource.Request('post', `${Config.REST_API_SERVER}/api/pub/federation/leaderboard/${this.pid}_${this.phase}_${this.name}`, JSON.stringify(body));
    }

    //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    MyEntry()
    {
        return Resource.Request('get', `${Config.REST_API_SERVER}/api/pub/federation/leaderboard/${this.pid}_${this.phase}_${this.name}/${this.userid}`);
    }

    //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    DeleteMyEntry()
    {
        let body = {
            userid: this.userid,
        }
        return Resource.Request('post', `${Config.REST_API_SERVER}/api/pri/federation/leaderboard/${this.pid}_${this.phase}_${this.name}/delete`, JSON.stringify(body));
    }
}
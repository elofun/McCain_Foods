import { EventTarget } from 'cc';

class EventManager extends EventTarget
{
    private instance: EventManager = null;
    GetInstance()
    {
        if (this.instance == null)
        {
            this.instance = new EventManager()
        }
        return this.instance;
    }
}
export default new EventManager;

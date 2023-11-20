import {Actions, Bind} from "../const.js";

export class EventsManager{
    constructor() {
        this.bind = Bind;
        this.action = Actions;

        this.setup = ((canvas) => {
            document.body.addEventListener("keydown", this.onKeyDown);
            document.body.addEventListener("keyup", this.onKeyUp);
        })

        this.onKeyDown =((event) => {
            let action = this.bind[event.keyCode];
            if(action)
            this.action[action] = true;
        });

        this.onKeyUp = ((event) => {
            let action = this.bind[event.keyCode];
            if(action)
                this.action[action] = false;
        })

    }
}

export let eventsManager = new EventsManager();

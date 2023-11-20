import {eventsManager} from "./eventsManager.js";
import {mapManager} from "./mapManager.js";
import {spriteManager} from "./spriteManager.js";
import {Enemy} from "../model/enemy.js";
import {Player} from "../model/player.js";
import {Bonus} from "../model/bonus.js";
import {canvas, ctx} from "../game.js";
import {Entity} from "../model/entity.js";
import {soundManager} from "./soundManager.js";

export class GameManager{

        factory = {}
        entities = [];
        player = null;
        laterKill = [];
        interval = null;
        LVL = 0;

        music = ["../sounds/init.mp3", "../sounds/play.mp3", "../sounds/bonus.mp3",
            "../sounds/kill.mp3", "../sounds/kill_wall.mp3", "../sounds/weapon.mp3",
            "../sounds/health_minus.mp3", "../sounds/Level_up.mp3", "../sounds/game_over.mp3"]


    initPlayer(obj) {
        this.player = obj;
    }

    kill(obj) {
        this.laterKill.push(obj)
    }

    update() {
        // let cookies = 0;
        if (this.player === null)
            return;
        this.player.move_x = 0;
        this.player.move_y = 0;


        if (eventsManager.action["up"]) {
            this.player.move_y = -1
            this.player.move_x = 0
            this.player.name = "player_up";
        }

        if (eventsManager.action["down"]) {
            this.player.move_y = 1
            this.player.move_x = 0
            this.player.name = "player";
        }
        if (eventsManager.action["left"]) {
            this.player.move_x = -1
            this.player.move_y = 0
            this.player.name = "player_left";
        }
        if (eventsManager.action["right"]) {
            this.player.move_x = 1
            this.player.move_y = 0
            this.player.name = "player_right";
        }


        if (eventsManager.action["fire"]) this.player.fire();
        if (eventsManager.action["cut"]) this.player.cut();

        this.entities.forEach((e) => {
            try {
                    e.update();

            } catch (ex) {

            }
        });

        for (let i = 0; i < this.laterKill.length; i++) {
            let idx = this.entities.indexOf(this.laterKill[i]);
            if (idx > -1)
                this.entities.splice(idx, 1);
        }
        if (this.laterKill.length > 0) {
            this.laterKill.length = 0;
        }
        mapManager.draw(ctx);
        this.draw(ctx);


    }

    draw(ctx) {
        if(this.entities.length === 0) {
            setTimeout(() => {
                this.draw(ctx);
            }, 100);
        }
        else {
            for (let e = 0; e < this.entities.length; e++) {
                this.entities[e].draw(ctx)
            }
        }

    }

    loadAll(levelMap,lvl) {
        this.LVL = lvl;
        mapManager.loadMap(levelMap);
        spriteManager.loadAtlas("../db/atlas.json", "../db/spritesheet.png");
        this.factory['Player'] = Player;
        this.factory["Enemy"] = Enemy;
        this.factory["Bonus"] = Bonus;
        this.factory["Entity"] = Entity;

        mapManager.parseEntities();

        mapManager.draw(ctx);
        eventsManager.setup(canvas);
        soundManager.init();
        soundManager.loadArray(this.music);
        soundManager.play(this.music[1], {looping: true});
    }

    play() {
        this.interval = setInterval(updateWorld, 100);
    }

}

function updateWorld() {
    gameManager.update()
}

export let gameManager = new GameManager();
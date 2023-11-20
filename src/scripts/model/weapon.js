import {Entity} from "./entity.js";
import {spriteManager} from "../managers/spriteManager.js";
import {physicManager} from "../managers/physicManager.js";
import {gameManager} from "../managers/gameManager.js";
import {soundManager} from "../managers/soundManager.js"; // импорт из глобального файла

export class Weapon extends Entity {

       move_x = 0;
        move_y = 0;
        speed = 3;


    draw(ctx) {
        //прориосвка объекта
        spriteManager.drawSprite(ctx, this.name, this.pos_x, this.pos_y, this.size_x, this.size_y); //название отследить
    }

    update() {
        //обновление в цикле
        physicManager.update(this);
    }

    onTouchEntity(obj) {
        if(obj.name === "enemy_left" || obj.name === "enemy_right" ){
            soundManager.play("../sounds/kill.mp3", {volume: 1.2})
            obj.kill();
            gameManager.player.score += 200;
            document.getElementById("score").textContent = String(gameManager.player.score);
            this.kill();
        }
        else{
            this.kill();
        }
    }

    kill() {
        //уничтожение объекта
        gameManager.laterKill.push(this);
    }
    onTouchMap(idx){
        this.kill();
        //уничтожение оружия, если оно попало куда-то
    }

}

export let weapon = new Weapon();
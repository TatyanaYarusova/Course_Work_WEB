import {Entity} from "./entity.js";
import {spriteManager} from "../managers/spriteManager.js";
import {gameManager} from "../managers/gameManager.js"; // импорт из глобального файла

export class Bonus extends Entity {


    draw(ctx){
        spriteManager.drawSprite(ctx, this.name, this.pos_x, this.pos_y, this.size_x, this.size_y); //название отследить
    }

    kill(){
        gameManager.laterKill.push(this);
    }
}

export let bonus = new Bonus();
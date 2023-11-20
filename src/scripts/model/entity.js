import {spriteManager} from "../managers/spriteManager.js";
import {gameManager} from "../managers/gameManager.js";

export class Entity {

        pos_x = 0;
        pos_y = 0;
        size_x = 0;
        size_y = 0;
        start_x = 0;
        start_y = 0;
        name = "";

        draw(ctx) {
                //прориосвка объекта
                spriteManager.drawSprite(ctx, this.name, this.pos_x, this.pos_y, this.size_x, this.size_y); //название отследить
        }
        kill(){
                if(this.name !== "door"){
                        gameManager.laterKill.push(this);
                }
        }

}
export let entity = new Entity();
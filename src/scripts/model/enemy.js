import {Entity} from "./entity.js";
import {spriteManager} from "../managers/spriteManager.js";
import {physicManager} from "../managers/physicManager.js";
import {gameManager} from "../managers/gameManager.js";
import {soundManager} from "../managers/soundManager.js";

export class Enemy extends Entity{

        move_x = -1;
        move_y = 0;
        speed = 2;
        move = true;



    draw(ctx) {
        spriteManager.drawSprite(ctx, this.name, this.pos_x, this.pos_y, this.size_x, this.size_y); //название отследить
    }

    update() {
        physicManager.update(this);
        this.checkForPlayer();
    }

    onTouchEntity(obj) {
        if(obj.name === "player" || obj.name === "player_left" || obj.name === "player_down" || obj.name === "player_right" ){
            this.fire(obj);
            console.log(obj.health)
            if(obj.health <= 0){

                obj.kill()
            }
        }
        else{
            this.onTouchMap(0);
        }
    }

    onTouchMap(idx) {
        if(this.move_y === 0) {
            this.move_x *= -1;
            if (this.move_x === -1) {
                this.name = "enemy_left"
            } else {
                this.name = "enemy_right";
            }
        }
        else{
            this.move_y *= -1;
        }
    }

    kill() {
        gameManager.laterKill.push(this);
    }

    fire(obj) {
        obj.health -= 1;
        obj.speed = 10
        soundManager.play("../sounds/health_minus.mp3", {volume: 1.2})
        document.getElementById('health').textContent = obj.health;
    }

    checkForPlayer() {
        let player = gameManager.player;
        if((Math.abs(this.pos_x - player.pos_x) <= 10) || (Math.abs(this.pos_y - player.pos_y) <= 10)) {
            this.A_star(player.pos_x, player.pos_y);
        }
    }

    A_star(dest_x, dest_y) {
        if (this.move_x !== 0) {
            this.move_x = 0;
            if (this.pos_y >= dest_y) this.move_y = -1;
            if (this.pos_y < dest_y) this.move_y = 1;
            physicManager.update(this);
            return;
        }

        if (this.move_y !== 0) {
            this.move_y = 0;
            if (this.pos_x >= dest_x) this.move_x = -1;
            if (this.pos_x < dest_x) this.move_x = 1;
            physicManager.update(this);

        }
    }

}
export let enemy = new Enemy();
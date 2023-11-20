import {Entity} from "./entity.js";
import {Weapon} from "./weapon.js";
import {gameManager} from "../managers/gameManager.js";
import {spriteManager} from "../managers/spriteManager.js"
import {physicManager} from "../managers/physicManager.js"
import {gameOver} from "../game.js";
import {soundManager} from "../managers/soundManager.js";
export class Player extends Entity {
        health = 25;
        move_x = 0;
        move_y = 0;
        speed = 5;
        score = 0;
        constructor() {
            super();
            document.getElementById('health').textContent = String(this.health);
        }



    draw(ctx) {
        //прориосвка объекта
        spriteManager.drawSprite(ctx, this.name, this.pos_x, this.pos_y, this.size_x, this.size_y); //название отследить
    }

    update() {
        //обновление в цикле
        physicManager.update(this);
    }

    onTouchEntity(obj) {

        switch (obj.name){
            case "bonus":
                obj.name = "bonus_open";
                this.score += 50;
                soundManager.play("../sounds/bonus.mp3", {volume: 1.2})
                document.getElementById("score").textContent = String(this.score);
                obj.kill();
                break;
            case "door":

                let level = document.getElementById("level").textContent;
                soundManager.play("../sounds/Level_up.mp3", {volume: 1.2})
                if(Number(level) === 1) {
                    localStorage.setItem("currentHealth", this.health);
                    localStorage.setItem("currentScore", String(this.score));
                    setTimeout(() => {
                        window.location.href = "level_2.html"
                    }, 1000);
                }

                else{
                    setTimeout(() => {}, 1000);
                    gameOver();
                }
                break;
            default:
                break;
        }
    }

    kill() {
       this.name ="player_daeth";
        soundManager.play("../sounds/game_over.mp3", {volume: 5})

       setTimeout(() => {gameOver()}, 2000);


    }

    cut(){
        if(this.name === "player_up"){
            this.move_y = -1
        }
        if(this.name === "player"){
            this.move_y = 1
        }
        if(this.name === "player_right"){
            this.move_x = 1
        }
        if(this.name === "player_left"){
            this.move_x = -1
        }

        let newX = this.pos_x + Math.floor(this.move_x * this.speed);
        let newY = this.pos_y + Math.floor(this.move_y * this.speed);
        let e = physicManager.entityAtXY(this, newX, newY); //объект на пути
        console.log("cut", e)
        if (e !== null){
            soundManager.play("../sounds/kill_wall.mp3", {volume: 1.2})
            e.kill();
        }
    }

    fire() {
        console.log("fire")
        //выстрел
        let weapon = new Weapon();
        soundManager.play("../sounds/weapon.mp3", {volume: 1.2})
        if(this.name === "player_up"){
            weapon.name = "weapon_up";
            weapon.move_y = -1
            weapon.pos_x = this.pos_x;
            weapon.pos_y = this.pos_y - 32;
        }
        if(this.name === "player"){
            weapon.name = "weapon_down";
            weapon.move_y = 1
            weapon.pos_x = this.pos_x;
            weapon.pos_y = this.pos_y + 32;
        }
        if(this.name === "player_right"){
            weapon.name = "weapon_right";
            weapon.move_x = 1
            weapon.pos_x = this.pos_x + 32;
            weapon.pos_y = this.pos_y;
        }
        if(this.name === "player_left"){
            weapon.name = "weapon_left";
            weapon.move_x = -1
            weapon.pos_x = this.pos_x - 32;
            weapon.pos_y = this.pos_y;
        }

        weapon.size_x = 32;
        weapon.size_y = 32;
        gameManager.entities.push(weapon);
    }

}

export let player = new Player();
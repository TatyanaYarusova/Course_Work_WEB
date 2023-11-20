import {gameManager} from "./managers/gameManager.js";
import {soundManager} from "./managers/soundManager.js";

let users = JSON.parse(localStorage.getItem("recordTable"));
export let canvas = document.getElementById("playField");
export let ctx = canvas.getContext("2d");


document.getElementById("userName").textContent =  localStorage.getItem("player");
let currentUser = document.getElementById("userName").textContent;
export let level = document.getElementById("level").textContent;

level = Number(level);


if(level === 1){
    gameManager.loadAll("../db/level_1.json");
}
else{
    document.getElementById("health").textContent = localStorage.getItem("currentHealth");
    document.getElementById("score").textContent = localStorage.getItem("currentScore");
    gameManager.loadAll("../db/level_2.json");
}
gameManager.draw(ctx);
gameManager.play();


export function gameOver(){
    let level = document.getElementById("level").textContent;
    let currentUser = document.getElementById("userName").textContent;
    let currentHealth = document.getElementById("health").textContent;
    let currentScore = document.getElementById("score").textContent;
    checkUsers(currentUser, currentScore, currentHealth);
    localStorage.setItem("recordTable", JSON.stringify(users));
    localStorage.setItem("currentName", currentUser);
    localStorage.setItem("currentScore", currentScore);
    localStorage.setItem("currentLevel", level);
    soundManager.stopFon();
    window.location.href = "gameOverPage.html"

}

function checkUsers(currentUser, currentScore, currentHealth){
    let flag = false;
    if (!users.length){
        users.push([currentUser, currentScore]);
    }
    else {
        for (let item = 0; item < users.length; item++) {
            if (users[item][0] === currentUser) {
                flag = true;
                if (users[item][1] < currentScore)
                    users[item][1] = currentScore;
                break;
            }
        }
        if(!flag)
            users.push([currentUser, currentScore]);
    }
}



import {soundManager} from "./managers/soundManager.js";

class Initializer {

    start(){
        let playerName = document.getElementById("userName").value;
        if (playerName) {
            localStorage.setItem('player', playerName);
            window.location.href = "historyPage.html";
            document.getElementById("error").textContent = "";
        }
        else {
            document.getElementById("error").textContent = "Введите имя пользователя";
        }
    }

    initButton(){
        let startButton = document.getElementById("startButton");
        startButton.addEventListener("click", this.start);
    }

}
soundManager.init();
soundManager.loadArray(["../sounds/init.mp3"]);
soundManager.play("../sounds/init.mp3", {volume: 2, looping: true})
let initializer = new Initializer();
initializer.initButton();
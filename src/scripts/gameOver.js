import {soundManager} from "./managers/soundManager.js";

document.getElementById("currentUser").textContent = "" + localStorage.getItem('currentName');
document.getElementById("currentLevel").textContent = "" + localStorage.getItem('currentLevel');
document.getElementById("currentScore").textContent = "" + localStorage.getItem('currentScore');
soundManager.init();
soundManager.loadArray(["../sounds/init.mp3"]);
soundManager.play("../sounds/init.mp3", {volume: 2, looping: true})
let users = JSON.parse(localStorage.getItem('recordTable'));
console.log(users)
users.sort(recordSort);

for(let i = 0; i < 5; i++){
    if(users[i]) {
        document.getElementById((i + 1) + '_name').textContent = users[i][0];
        document.getElementById((i + 1) + '_score').textContent = JSON.stringify(users[i][1]);
    }
}

function recordSort(a, b) {
    if (Number(a[1]) < Number(b[1])) return 1;
    else if (Number(a[1]) > Number(b[1])) return -1;
    else return 0;
}


import {mapManager} from "./mapManager.js"
import {gameManager} from "./gameManager.js";
export class PhysicManager {
    constructor() {
        this.SIZE = 16;
    }

    update(obj) {
        if (obj.move_x === 0 && obj.move_y === 0)
            return "stop";

        let newX = obj.pos_x + Math.floor(obj.move_x * obj.speed);
        let newY = obj.pos_y + Math.floor(obj.move_y * obj.speed);
        let tsLayer1 = mapManager.getTilesetIdx(newX + obj.size_x / 2, newY + obj.size_y / 2, 0); // анализ пространства на карте
        let tsLayer2 = mapManager.getTilesetIdx(newX + obj.size_x / 2, newY + obj.size_y / 2, 1); // анализ пространства на карте
        let e = this.entityAtXY(obj, newX, newY); //объект на пути
        if (e !== null && obj.onTouchEntity) {
            // obj.pos_x = newX;
            // obj.pos_y = newY;
            obj.onTouchEntity(e);
        }

        if (tsLayer1 !== 11 && tsLayer1 !== 14 && tsLayer1 !== 9  && obj.onTouchMap) { //проверить  ts cod
            obj.onTouchMap(tsLayer1);
        }
        if ((tsLayer1 === 11 || tsLayer1 === 14 || tsLayer1 === 9) && e === null) {
            obj.pos_x = newX;
            obj.pos_y = newY;
        } else {
            return "break";
        }
        return "move";
    }

    entityAtXY(obj, x, y) {
        for (let i = 0; i < gameManager.entities.length; i++) {
            let e = gameManager.entities[i];
            if (e.name !== obj.name) {
                if (x + obj.size_x < e.pos_x || y + obj.size_y < e.pos_y ||
                    x > e.pos_x + e.size_x || y > e.pos_y + e.size_y) {
                    continue;
                }
                return e;
            }
        }
        return null;
    }
}

export let physicManager = new PhysicManager();
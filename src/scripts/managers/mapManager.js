import {gameManager} from "./gameManager.js";

class MapManager {
    mapData = null; // карта
    tLayer = null; // ссылка на блоки карты
    xCount = 0; // количество блоков по горизонтали
    yCount = 0; // количество блоков по вертикали
    tSize = {x: 64, y: 64}; // размер блока в пикселях
    mapSize = {x: 15, y: 15}; // размер карты в пикселях
    tilesets = []; //массив описаний блоков

    imgLoadCount = 0;
    imgLoaded = false;
    jsonLoaded = false;

    tLayer = null;

    loadMap(path) {
        return new Promise((resolve, reject) => {
            let request = new XMLHttpRequest();
            request.onreadystatechange = () => {
                if (request.readyState === 4) {
                    if (request.status === 200) {
                        this.parseMap(request.responseText);
                        //resolve(request.response);
                    } else {
                        reject(new Error('Failed to load map'));
                    }
                }
            };
            request.open('GET', path, true);
            request.send();
        });
    }

    parseMap(tilesJSON) {
        this.mapData = JSON.parse(tilesJSON);
        // console.log(this.mapData)
        this.xCount = this.mapData.width;
        this.yCount = this.mapData.height;
        this.tSize.x = this.mapData.tilewidth;
        this.tSize.y = this.mapData.tileheight;
        this.mapSize.x = this.xCount * this.tSize.x;
        this.mapSize.y = this.yCount * this.tSize.y;

        for (let i = 0; i < this.mapData.tilesets.length; i++) {
            let img = new Image();
            img.onload = () => {
                this.imgLoadCount++;
                if (this.imgLoadCount === this.mapData.tilesets.length) {
                    this.imgLoaded = true;
                }
            };
            img.src = this.mapData.tilesets[i].image;
            let t = this.mapData.tilesets[i];
            let ts = {
                firstgid: t.firstgid,
                image: img,
                name: t.name,
                xCount: Math.floor(t.imagewidth / this.tSize.x),
                yCount: Math.floor(t.imageheight / this.tSize.y),
            };
            this.tilesets.push(ts);
        }
        this.jsonLoaded = true;
    }


    draw(ctx) { // переделать функцию

        if(!this.imgLoaded || !this.jsonLoaded){
            setTimeout(() => {this.draw(ctx)}, 100);
        }
        else{
            // if(this.tLayer === null){
                for( let id = 0; id < this.mapData.layers.length; id++){
                    let layer = this.mapData.layers[id];
                    if(layer.type === "tilelayer"){ //проверка на тип objects
                        this.tLayer = layer;
                        this.drawLayer(ctx, layer);
                        // break;
                    }

                }
            // }

        }
    }

    drawLayer(ctx, currentLayer){
        for( let i = 0; i < currentLayer.data.length; i++){
            if(currentLayer.data[i] !== 0){
                let tile = this.getTile(currentLayer.data[i]);
                let pX = (i % this.xCount) * this.tSize.x
                let pY = Math.floor(i / this.xCount) * this.tSize.y;
                ctx.drawImage(tile.img, tile.px, tile.py, this.tSize.x, this.tSize.y, pX, pY, this.tSize.x, this.tSize.y);
            }
        }
    }

    getTile(tileIndex){
        let tile = {
            img: null,
            px: 0,
            py: 0,
        };
        let tileset = this.getTileset(tileIndex);
        tile.img = tileset.image;
        let id = tileIndex - tileset.firstgid;
        let x = id % tileset.xCount;
        let y = Math.floor(id / tileset.xCount);
        tile.px = x * this.tSize.x;
        tile.py = y * this.tSize.y;
        return tile;
    }

    getTileset(tileIndex) {
        for(let i = this.tilesets.length - 1; i >= 0; i--){
            if(this.tilesets[i].firstgid <= tileIndex){
                return this.tilesets[i];
            }
        }
        return null;
    }

    parseEntities() {
        if (!this.imgLoaded || !this.jsonLoaded) {
            setTimeout(() => { this.parseEntities() }, 100);
        } else {
            for (let j = 0; j < this.mapData.layers.length; j++) {
                if (this.mapData.layers[j].type === 'objectgroup') {
                    const entities = this.mapData.layers[j];
                    for (let i = 0; i < entities.objects.length; i++) {
                        const e = entities.objects[i];
                        try {
                            let obj = new gameManager.factory[e.type];
                            obj.name = e.name;
                            obj.pos_x = e.x;
                            obj.pos_y = e.y - e.height;
                            obj.size_x = e.width;
                            obj.size_y = e.height;
                            obj.start_x = e.x;
                            obj.start_y = e.y;
                            gameManager.entities.push(obj);
                            if (e.type === "Player") {
                                gameManager.initPlayer(obj);
                            }
                        } catch (ex) {
                            console.log("ERROR while creating:[" + e.gid + "]" + e.type + "," + ex);
                        }
                    }
                }
            }
            // console.log(gameManager.entities)
        }
    }

    getTilesetIdx(x, y, id) {

        let wX = x;
        let wY = y;
        let idx = Math.floor(wY / this.tSize.y) * this.xCount + Math.floor(wX / this.tSize.x)
        return  this.mapData.layers[id].data[idx];
    }

    // centerAt(x, y) {
    //     if (x < this.view.w / 2)
    //         this.view.x = 0;
    //     else if (x > this.mapSize.x - this.view.w / 2)
    //         this.view.x = this.mapSize.x - this.view.w
    //     else
    //         this.view.x = x - (this.view.w / 2)
    //
    //     if (y < this.view.h / 2)
    //         this.view.y = 0;
    //     else if (y > this.mapSize.y - this.view.h / 2)
    //         this.view.y = this.mapSize.y - this.view.h
    //     else
    //         this.view.y = y - (this.view.h / 2)
    // }
}

export let mapManager = new MapManager();

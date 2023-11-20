export class SpriteManager {
    constructor() {
        this.image = new Image();
        this.sprites = [];
        this.imgLoaded = false;
        this.jsonLoaded = false;
    }


    loadAtlas(atlasJson, atlasImg) {
        return new Promise((resolve, reject) => {
            let request = new XMLHttpRequest();
            request.onreadystatechange = () => {
                if (request.readyState === 4) {
                    if (request.status === 200) {
                        this.parseAtlas(request.responseText);
                        resolve();
                    } else {
                        reject(new Error("Failed to load atlas JSON: " + "atlasJson"));
                    }
                }
            };
            request.open("GET", atlasJson, true);
            request.send();
        })
            .then(() => this.loadImg(atlasImg))
            .catch(error => console.error(error));
    }


    loadImg(imgName) {
        this.image.onload = () => {
            this.imgLoaded = true;
        }
        this.image.src = imgName
    }

    parseAtlas(atlasJSON) {
        let atlas = JSON.parse(atlasJSON)
        for (let name of atlas.frames) {
            let frame = name.frame;
            this.sprites.push({name: name.filename, x: frame.x, y: frame.y, w: frame.w, h: frame.h});
        }
        // console.log(this.sprites);
        this.jsonLoaded = true;
    }

    drawSprite(ctx, name, x, y, dx, dy) {
        if (!this.imgLoaded || !this.jsonLoaded) {
            setTimeout(() => {this.drawSprite(ctx, name, x, y)}, 100)
        } else {
            let sprite = this.getSprite(name);
            // if (!mapManager.isVisible(x, y, sprite.w, sprite.h))
            //     return
            // x -= mapManager.view.x;
            // y -= mapManager.view.y;
            //console.log( sprite.x, sprite.y, sprite.w, sprite.h, x, y, sprite.w, sprite.h)
            ctx.drawImage(this.image,sprite.x, sprite.y, sprite.w, sprite.h, x, y, dx, dy);
        }
    }

    getSprite(name) {
        for (let i = 0; i < this.sprites.length; i++) {
            let s = this.sprites[i];
            if (s.name === name)
                return s
        }
        return null;
    }
}

export let spriteManager = new SpriteManager();
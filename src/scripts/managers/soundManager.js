export class SoundManager {
    constructor() {
        this.clips = {}
        this.context = null;
        this.gainNode = null;
        this.loaded = false;
        this.fon = null;
        // this.init();

    }

    init() {
        this.context = new AudioContext();
        console.log(this.context);
        this.context.resume();
        this.gainNode = this.context.createGain() ? this.context.createGain() : this.context.createGainNode();
        this.gainNode.connect(this.context.destination)
    }

    load(path, callback) {
        if (this.clips[path]) {
            callback(this.clips[path]);
            return;
        }
        let clip = {path: path, buffer: null, loaded: false};

        clip.play = ((volume, loop) => {
            this.play(path, {looping: loop ? loop : false, volume: volume ? volume : 1});
        });
        this.clips[path] = clip;
        let request = new XMLHttpRequest();
        request.open("GET", path, true);
        request.responseType = "arraybuffer";
        request.onload = (() => {
            console.log(this.context);
            this.context.decodeAudioData(request.response,
                 ((buffer) => {
                    clip.buffer = buffer;
                    clip.loaded = true;
                    callback(clip);
                }));
        });
        request.send();
    }

    loadArray(array) {
        array.forEach((item) => {
            this.load(item, () => {
                const loadedSounds = Object.keys(this.clips);
                if (array.length === loadedSounds.length && loadedSounds.every(sd => this.clips[sd].loaded)) {
                    this.loaded = true;
                }
            });
        });
        console.log("loaded");
    }

    play(path, setting) {
        if(!this.loaded){
            setTimeout(() => {
                this.play(path, setting)
            }, 1000)
            return;
        }
        let looping = false;
        let volume = 1;
        if(setting){
            if(setting.looping)
                looping = setting.looping
            if(setting.volume)
                if(path === "../sounds/play.mp3"){
                    volume = 1;
                }
            else
                volume = setting.volume
        }
        let sd = this.clips[path];
        if(sd === null)
            return false;

        let sound = this.context.createBufferSource();
        sound.buffer = sd.buffer;
        sound.connect(this.gainNode);
        sound.loop = looping;
        this.gainNode.gain.value = volume;
        sound.start(0);
        if(path === "../sounds/play.mp3"){
            this.fon = sound;
        }
        return true;
    }
    stopFon(){
        this.fon.stop(0);
    }
}

export let soundManager = new SoundManager();
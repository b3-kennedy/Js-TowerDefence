export default class SoundManager{
    constructor(game){
        this.game = game;

        this.audioFiles = {};

        var sounds = {
            shoot: './sound/shoot.mp3',
            song: './sound/song.mp3',
            test: './sound/sus-meme-sound-181271.mp3',
            test2: './sound/yeah-boy-114748.mp3'
        };

        for (const [key, value] of Object.entries(sounds)) {
            this.loadSounds(key, value);
        }

    }

    loadSounds(name, path){
        var audio = new Audio(path);
        audio.load();
        this.audioFiles[name] = audio
    }

    playAudio(name,loop=false, volume = 1.0){
        if(this.audioFiles[name]){
            var file = this.audioFiles[name];
            file.volume = volume;
            file.loop = loop;
            file.play();
        }
    }

    playOneShot(name, volume = 1.0, pitch = 1.0) {
        if(this.audioFiles[name]){
            const audio = new Audio(this.audioFiles[name].src);
            audio.volume = volume;
            audio.playbackRate = pitch;
            audio.play();
        }

    }

}
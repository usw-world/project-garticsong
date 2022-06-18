import { writable } from "svelte/store";
import { io } from "socket.io-client";

// export const socket = writable(io("http://10.30.5.129:2023"));
export const socket = writable(io("http://localhost:2023"));
// export const socket = writable(io("https://garticsong.herokuapp.com/"));

export let musicVolume = writable({
    value: 50,
    set: (volume) => {
        musicVolume.update(obj => {
            return {
                ...obj,
                value: volume
            }
        });
        musicVolumeObj.setVolumeEvent(volume);
    },
    get: () => musicVolumeObj.volume,
    setVolumeEvent: (v) => {/* v is next volume */},
});
let musicVolumeObj;
musicVolume.subscribe(value => {
    musicVolumeObj = value;
})
let audio = new Audio();
audio.volume = .5;
export let PlayAudio = (src, volume) => { // >> /soundEffects/
    audio.src = src;
    if(volume) audio.volume = volume;
    audio.play();
}
export let tryGuess = writable({
    Run: (e) => {
        tryGuessObj.OnTryGuess[e.sender.id] && tryGuessObj.OnTryGuess[e.sender.id](e);
    },
    OnTryGuess: {},

})
let tryGuessObj;
tryGuess.subscribe(value => {
    tryGuessObj = value;
})
export const game = writable({
    room: {
        roomId: null,
        users: [],
        config: {
            "qs": 100,
            "as": 100,
            "time": 20
        }
    }
});
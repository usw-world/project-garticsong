import { writable } from "svelte/store";
import { io } from "socket.io-client";

// export const socket = writable(io("http://10.30.5.129:2023"));
export const socket = writable(io("http://localhost:2023"));
// export const socket = writable(io("https://garticsong.herokuapp.com/"));

let audio = new Audio();
audio.volume = .5;
export let PlayAudio = (src, volume) => { // >> /soundEffects/
    audio.src = src;
    if(volume) audio.volume = volume;
    audio.play();
}
export const game = writable({
    room: {
        roomId: null,
        users: []
    }
});
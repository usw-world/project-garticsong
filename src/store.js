import { writable } from "svelte/store";
import { io } from "socket.io-client";

export const socket = writable(io("http://10.30.5.129:2023"));
export const game = writable({
    room: {
        roomId: null,
        users: []
    }
});
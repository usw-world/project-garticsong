import { writable } from "svelte/store";
import { io } from "socket.io-client";

export const socket = writable(io("http://localhost:2023"));
export const game = writable({
    room: {
        roomId: null,
        users: []
    }
});
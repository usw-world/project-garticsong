<script>
    import { onMount } from 'svelte';

    import { game, socket as mainSocket } from "./store";
    let socket;
    mainSocket.subscribe(value => { socket = value; })

    let thisGame;
    game.subscribe(value => { thisGame = value; });

    let container;
    
    import Lobby from './Lobby.svelte';
    import GameRoom from './GameRoom/GameRoom.svelte';
    import Intro from './Intro.svelte';

    import { module as cookieManager } from './cookieManager';

    let gameStateList = {
        INTRO: 0,
        LOBBY: 1,
        ROOM: 2,
        RESULT: 3,
        NOT_EXIST_ROOM: 4,
    };
    let currentState = 0;
    
    (() => {
        let url = new URL(window.location.href);
        let joinRoomParameter = url.searchParams.get("jr");
        if(joinRoomParameter) {
            socket.on("result-check", (isExist) => {
                if(isExist) {
                    game.update(game => {
                        return {
                            ...game,
                            isGuest : true
                        }
                    });
                } else {
                    currentState = gameStateList.NOT_EXIST_ROOM;
                }
            })
            socket.emit("check-room", joinRoomParameter);
        };
    })();

    const COOKIE_EXPIRES_TIME = new Date(Date.now() + 900000) // 15minute
    onMount(() => {
        socket.on("game-start", (updatedRoom) => {
            console.log(updatedRoom);
            game.update(game => {
                console.log(game)
                return {
                    ...game,
                    room : {...updatedRoom},
                };
            });
            console.log(thisGame);
            SetGameState(gameStateList.ROOM);
        });
        socket.on("disconnect", () => {
            console.log("client is free");
        })
    });

    let isLoading = false;
    let SetGameState = (nextState, fadeTime, callfront, callback) => {
        if(isLoading) return;
        isLoading = true;
        if(callfront) callfront();
        if(!fadeTime) fadeTime = 500;

        if(nextState < 0 || nextState > Object.values(gameStateList).reduce((a, b) => Math.max(a, b))) {
            console.error("function:SetGameState received a unvaild value. \nnextState : ", nextState);
            return;
        }
        container.style.setProperty("animation", `fadeUpOut ${fadeTime}ms ease 1 forwards`);
        console.dir(container.style.animation);
        setTimeout(() => {
            currentState = nextState;
            container.style.animation = `fadeUpIn ${fadeTime}ms ease 1 forwards`;
            if(callback) callback();
            isLoading = false;
        }, fadeTime);
    }
    let SetPlayerInformation = (info) => {
        let player = {
            id: info.id,
            name: info.name,
            profileImage: info.profileImage
        };
        game.update(game => {
            return {
                ...game,
                player : player
            }
        });
    }
    let props = {
        thisGame,
        gameStateList,
        SetGameState,
        SetPlayerInformation,
    }
</script>

<div class="container" bind:this="{container}">
    {#if currentState===gameStateList.INTRO}
    <Intro props={props}></Intro>
    {:else if currentState===gameStateList.LOBBY}
    <Lobby props={props}></Lobby>
    {:else if currentState===gameStateList.ROOM}
    <GameRoom></GameRoom>
    {:else if currentState===gameStateList.RESULT}
    temporary
    {:else if currentState===gameStateList.RESULT}
    not exixt room
    {/if}
</div>

<style></style>
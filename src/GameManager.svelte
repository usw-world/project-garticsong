<script>
    import { onMount } from 'svelte';
    import { io } from "socket.io-client";
    // const socket = io("https://garticsong.herokuapp.com/");
    const socket = io("http://localhost:2023");
    // const socket = io("http://192.168.219.101:2023");

    import { game } from "./store";
    let thisGame;
    game.subscribe(value => {
        thisGame = value;
    });
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

    const COOKIE_EXPIRES_TIME = new Date(Date.now() + 900000)
    game.update((game) => {
        return {
            ...game,
            player: cookieManager.GetAllCookies().userInfo 
                    && JSON.parse(cookieManager.GetAllCookies().userInfo) 
                    || {
                        name : null,
                        profile : null
                    }
        }
    })
    onMount(() => {
        console.log(thisGame);
    });

    let SetGameState = (nextState) => {
        if(nextState < 0 || nextState > Object.values(gameStateList).reduce((a, b) => Math.max(a, b))) {
            console.error("function:SetGameState received a unvaild value. \nnextState : ", nextState);
            return;
        }
        currentState = nextState;
    }
    let SetUserInformation = (info) => {
        let player = {
            name: info.name,
            profilePicture: info.profilePicture
        };
        cookieManager.SetCookie("userInfo", JSON.stringify(player))
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
        SetUserInformation
    }
</script>

<div class="container">
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
<script>
    import { onMount } from 'svelte';

    import Relayer from './Relayer.svelte';
    import Lobby from './Lobby.svelte';
    import GameRoom from './GameRoom/GameRoom.svelte';
    import Intro from './Intro.svelte';

    import { module as cookieManager } from './cookieManager';

    const COOKIE_EXPIRES_TIME = new Date(Date.now() + 900000)
    let game = {
        player: cookieManager.GetAllCookies().userInfo 
                && JSON.parse(cookieManager.GetAllCookies().userInfo) 
                || {
                    name : null,
                    profile : null
                }
    }
    onMount(() => {
        console.log(game.player);
    });

    let gameStateList = {
        INTRO: 0,
        LOBBY: 1,
        ROOM: 2,
        RESULT: 3,
    };
    let currentState = 0;

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
        game.player = player;
    }
    let props = {
        game,
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
    {/if}
</div>
<script>
    export let info;
    import { onMount } from "svelte";
    import { tryGuess, game } from "./store";
    import UserImageBox from "./UserImageBox.svelte";
    let thisGame;
    game.subscribe(value => {
        thisGame = value;
    })
    let tryGuessObj;
    tryGuess.subscribe(value => {
        tryGuessObj = value;
    })
    onMount(() => {
        let updatedObj = {...tryGuessObj};
        console.log(updatedObj);
        updatedObj.OnTryGuess[info.id] = SayAnswer;
        tryGuess.set(updatedObj);
        console.log(tryGuessObj);
    })
    let speechBubble;
    let speechScript = "";
    function SayAnswer(e) {
        speechScript = e.title;
        speechBubble.style.setProperty("animation", "none");
        speechBubble.offsetHeight;
        speechBubble.style.setProperty("animation", "speechBubble 2500ms ease-in-out 1 forwards");
    }
</script>

<li class="user-item {info.id===thisGame.player.id ? "me" : "other"}">
    {#if info.id === thisGame.room.host.id}
        <img class="hosts-crown" src="../images/crown.svg" alt="">
    {/if}
    <span class="image-box">
        <UserImageBox imageNumber={info.profileImage} width={"100%"}/>
    </span>
    <span class="user-name">
        {info.name}
    </span>
    <div class="speech-bubble" bind:this={speechBubble}>
        <div class="content">
            {speechScript}
        </div>
    </div>
</li>

<style>
    .speech-bubble {
        position: absolute;
        top: -29%; left: 70%;
        display: inline-block;
        padding: 1rem 1.4rem;
        background-color: #fff;
        border-radius: 3rem 3rem 3rem 0;
        border: .4rem solid #232323;
        box-sizing: border-box;
        opacity: 0;
        pointer-events: none;
        z-index: 10;
    }
    .content {
        display: inline-block;
        max-width: 20rem;
        width: auto;
        color: #232323;
        font-size: 2rem;
        font-weight: 900;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .user-item {
        position: relative;
        width: 100%;
        height: 8rem;
        margin: 0.5rem 0;
        padding: 1.1rem;
        padding-right: 5rem;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        border-radius: 0 4rem 4rem 0;
        border: .3rem solid #fff;
    }
    .user-item.me {
	    background: linear-gradient(-45deg, rgba(21, 21, 21, 0.3), rgba(21, 21, 21, 0.75)),
				linear-gradient(-45deg, var(--point-color-a), var(--point-color-b));
	    background-clip: padding-box, border-box;
        background-origin: border-box;
    }
    .image-box {
        display: inline-block;
        border-radius: 0 0 50% 50%;
        overflow: hidden;
        width: 35%;
        max-height: 7rem;
    }
    .user-name {
        display: inline-block;
        width: 65%;
        font-size: 1.9rem;
        font-weight: 900;
        padding-left: .7rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .hosts-crown {
        position: absolute;
        top: 26%; right: 6%;
        width: 15%;
    }
</style>
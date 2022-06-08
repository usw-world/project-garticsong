<script>
    export let info;
    import { game } from "./store";
    let thisGame;
    game.subscribe(value => {
        thisGame = value;
    })
</script>

<li class="user-item {info.id===thisGame.player.id ? "me" : ""}">
    <span class="image-box">
        {#if info.profileImage==0}
            <img src="../images/main-character.svg" alt="">
        {:else if info.profileImage==1}
            <img src="../images/main-character.svg" alt="" style="transform: rotate(90deg);">
        {:else if info.profileImage==2}
            <img src="../images/main-character.svg" alt="" style="transform: rotate(180deg);">
        {:else if info.profileImage==3}
            <img src="../images/main-character.svg" alt="" style="transform: rotate(270deg);">
        {/if}
    </span>
    <span class="user-name">
        {info.name}
    </span>
</li>

<style>
    .user-item {
        position: relative;
        width: 100%;
        margin: 0.5rem 0;
        padding: 1.1rem;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        border: .3rem solid #fff;
        box-sizing: border-box;
        border-radius: 0 4rem 4rem 0;
    }
    .me {
	    border: .3rem solid transparent;
        box-sizing: border-box;
	    background: linear-gradient(#151515, #151515),
				linear-gradient(-45deg, var(--point-color-a), var(--point-color-b));
	    background-clip: padding-box, border-box;
    }
    .image-box {
        display: inline-block;
        width: 25%;
    }
    .image-box img {
        width: 100%;
    }
    .user-name {
        display: inline-block;
        width: 75%;
        font-size: 1.9rem;
        font-weight: 900;
        padding-left: .7rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>
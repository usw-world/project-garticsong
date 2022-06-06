<script>
    export let user;
    export let maxScore;
    let height = user.score / maxScore * 30;
</script>

<div class="personal-score">
    <div class="image-wrap">
        <span class="image-box">
            {#if user.profileImage==0}
                <img src="../images/main-character.svg" alt="">
            {:else if user.profileImage==1}
                <img src="../images/main-character.svg" alt="" style="transform: rotate(90deg);">
            {:else if user.profileImage==2}
                <img src="../images/main-character.svg" alt="" style="transform: rotate(180deg);">
            {:else if user.profileImage==3}
                <img src="../images/main-character.svg" alt="" style="transform: rotate(270deg);">
            {/if}
        </span>
    </div>
    <div class="graph" style="
        height: {height}rem;
    ">
        <span class="fill" style="
            background: {maxScore!==user.score ? "#fff" : "linear-gradient(45deg, var(--point-color-a), var(--point-color-b))"};
        "></span>
    </div>
    <div class="score">{user.score}</div>
    <div class="name">{user.name}</div>
</div>

<style>
    .personal-score {
        display: flex;
        width: 13%;
        height: 100%;
        text-align: center;
        flex-direction: column;
        justify-content: end;
        overflow: hidden;
    }
    .image-box {
        display: inline-block;
        width: 88%;
    }
    .image-box>img {
        width: 100%;
    }
    .graph {
        display: inline-block;
        padding: 1.2rem 0 1.5rem;
        box-sizing: border-box;
    }
    .fill {
        display: inline-block;
        width: 8rem;
        height: 100%;
        border-radius: 2rem 2rem .5rem .5rem;
    }
    .score {
        font-size: 3rem;
        font-weight: 900;
        letter-spacing: -.1rem;
    }
    .name {
        font-size: 1.9rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: 100;
        letter-spacing: -.1rem;
    }
</style>
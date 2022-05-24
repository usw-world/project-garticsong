<script>
    export let info;
    
</script>

<li class="user-item">
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
        box-sizing: border-box;
        border: .3rem solid #fff;
        border-radius: 0 4rem 4rem 0;
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
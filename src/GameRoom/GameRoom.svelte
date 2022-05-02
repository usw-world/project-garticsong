<script>
    import UserInfo from './UserInformation.svelte';
    import Questioner from './Questioner.svelte';
</script>

<div class="room-wrap">
    <div class="room-left">
        <div class="box-wrapper">
            <UserInfo></UserInfo>
        </div>
    </div>
    <div class="room-right">
        <div class="box-wrapper">
            <Questioner></Questioner>
        </div>
    </div>
</div>

<style>
    .room-wrap {
        display: flex;
        max-width: 1200px;
        width: 100%;
        height: 70rem;
        margin: 0 auto;
        gap: 1rem;
    }
    .room-left,
    .room-right {
        height: 100%;
        box-sizing: border-box;
        border: 5px solid transparent;
    }
    .room-left {
        width: 22%;
        background: linear-gradient(#151515, #151515),
        linear-gradient(-45deg, var(--point-color-a), var(--point-color-b));
        background-origin: border-box;
        background-clip: content-box, border-box;
        border-radius: 0 0 0 10rem;
    }
    .box-wrapper {
        width: 100%;
        height: 100%;
    }
    .room-right {
        width: 78%;
        height: 100%;
        background: linear-gradient(#151515, #151515),
        linear-gradient(45deg, var(--point-color-a), var(--point-color-b));
        background-origin: border-box;
        background-clip: content-box, border-box;
        border-radius: 0 0 10rem 0;
    }
</style>
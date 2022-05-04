<script>
    import LobbyGuide from "./LobbyGuide.svelte";
    import LobbyButtonArea from './LobbyButtonArea.svelte';
    import Logo from './Logo.svelte';
</script>

<div class="lobby-wrap">
    <div class="lobby-left">

    </div>
    <div class="lobby-center">
        <LobbyGuide></LobbyGuide>
    </div>
    <div class="lobby-right">
        <div class="logo-area">
            <Logo />
            <LobbyButtonArea></LobbyButtonArea>
        </div>
        
    </div>
</div>

<style>
    .lobby-wrap {
        display: flex;
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
    }
    .lobby-left {
        width: 20%;
    }
    .lobby-center {
        width: 60%;
    }
    .lobby-right {
        width: 20%;
    }
</style>
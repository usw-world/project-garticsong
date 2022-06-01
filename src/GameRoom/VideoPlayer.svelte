<script>
    import { onMount } from "svelte";
    import { game } from "../store";
    let thisGame;
    game.subscribe(value => {
        thisGame = value;
    })
    
    export let OnReady;
    export let videoId;
    export let AddEventStartRound;
    export let StartEvent;

    let videoPlayerElmt;
    let targetVideo;

    onMount(() => {
        LoadNewVideo(videoId);
    })
    function LoadNewVideo(videoId) {
        const CHILD_ID = "youtube-video-player";
        if(document.querySelector(`#${CHILD_ID}`)) {
            document.querySelector("#player-wrap").removeChild(document.querySelector(`#${CHILD_ID}`));
        }
        let child = document.createElement("div");
        child.id = CHILD_ID;
        document.querySelector("#player-wrap").appendChild(child);
        videoPlayerElmt = new YT.Player(CHILD_ID, {
            videoId: videoId,
			height: 1,
            events: {
                "onReady": OnReadyPlay,
                "onStatChange": OnStatChange,
            }
        });
    }
    function PlayMusic() {
        setTimeout(() => {
            StartEvent();
            targetVideo.playVideo();
        }, 2000);
    }
    function OnReadyPlay(e) {
        targetVideo = e.target;
        AddEventStartRound(PlayMusic);
        OnReady(e)
    }
    function OnStatChange(e) {
        e.target.playVideo();
    }
</script>

<div id="player-wrap"></div>

<style>
    #player-wrap {
        height: 0;
        overflow: hidden;
    }
</style>
<script>
    import { onMount } from "svelte";
    import { game } from "../store";
    let thisGame;
    game.subscribe(value => {
        thisGame = value;
    })
    
    export let OnReady;
    export let videoId;
    export let startRound;
    export let endRound;
    export let OnRoundStart;
    export let OnRoundEnd;

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
                "onReady": OnReadyToPlay,
                "onStatChange": OnStatChange,
            }
        });
    }
    function StartRoundHandler() {
        setTimeout(() => {
            OnRoundStart();
            targetVideo.playVideo();
        }, 2000);
    }
    function StopRoundHandler() {
        OnRoundEnd();
        const currentVolume = targetVideo.getVolume();
        for(let i=0; i<10; i++) {
            setTimeout(() => {
                targetVideo.setVolume(currentVolume - currentVolume / 10 * (i+1));
            }, 200*i);
        }
    }
    function OnReadyToPlay(e) {
        targetVideo = e.target;
        startRound.AddEvent(StartRoundHandler);
        endRound.AddEvent(StopRoundHandler);
        OnReady(e);
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
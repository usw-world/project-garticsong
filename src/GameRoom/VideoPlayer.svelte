<script>
    import { onMount } from "svelte";

    export let videoId;
    let videoPlayerElmt;

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
                "onReady": OnPlayerReady,
                "onStatChange": OnStatChange,
            }
        });
    }
    function PlayMusic(e) {
        e.target.playVideo();
    }
    function OnPlayerReady(e) {
        PlayMusic(e);
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
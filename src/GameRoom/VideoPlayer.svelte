<script>
    import { onMount } from "svelte";
    import { game, musicVolume } from "../store";
    let thisGame;
    game.subscribe(value => {
        thisGame = value;
    })
    let musicVolumeObj;
    musicVolume.subscribe(value => {
        musicVolumeObj = value;
    })
    
    export let OnReady;
    export let videoInfo;
    export let startRound;
    export let endRound;
    export let OnRoundStart;
    export let OnRoundEnd;

    let videoPlayerElmt;
    let targetVideo;

    onMount(() => {
        LoadNewVideo(videoInfo.videoId);
        musicVolume.update(obj => {
            return {
                ...obj,
                setVolumeEvent: SetPlayerVolume
            }
        })
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
            OnRoundStart && OnRoundStart();
            targetVideo.loadVideoById({
                videoId: videoInfo.videoId, startSeconds: videoInfo.startSeconds || 0,
            })
            targetVideo.playVideo();
            for(let i=0; i<10; i++) {
                setTimeout(() => {
                    const currentVolume = musicVolumeObj.value===0 ? 0 : musicVolumeObj.value || 50;
                    targetVideo.setVolume(currentVolume / 10 * (i+1));
                }, 200*i);
            }   
        }, 2000);
    }
    function StopRoundHandler() {
        OnRoundEnd && OnRoundEnd();
        for(let i=0; i<10; i++) {
            setTimeout(() => {
                let currentVolume = musicVolumeObj.value;
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
    function SetPlayerVolume(volume) {
        if(targetVideo.setVolume) targetVideo.setVolume(volume);
    }
</script>

<div id="player-wrap"></div>

<style>
    #player-wrap {
        height: 0;
        overflow: hidden;
    }
</style>
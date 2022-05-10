<!-- 
<script>
    // let videoPlayerElmt;
    
    // function OnYouTubeIframeAPIReady() {
    //     console.log("Youtube API got ready");
    // }
    // test-case 
    // https://www.youtube.com/watch?v=pKv_wua6kFE
    // pKv_wua6kFE

    // list test-case
    // https://www.youtube.com/watch?v=3GWscde8rM8&list=PLd6UgfNCWmp8bnixMcfgv_wcSMN_niBqx
    // 3GWscde8rM8
    // function LoadNewVideo(_videoId) {
    //     const CHILD_ID = "youtube-video-player";
    //     if(document.querySelector(`#${CHILD_ID}`)) {
    //         document.querySelector("#player-wrap").removeChild(document.querySelector(`#${CHILD_ID}`));
    //     }

    //     let child = document.createElement("div");
    //     child.id = CHILD_ID;
    //     document.querySelector("#player-wrap").appendChild(child);
    //     videoPlayerElmt = new YT.Player(CHILD_ID, {
    //         videoId: _videoId,
	// 		width: 0,
	// 		height: 0,
    //         events: {
    //             // "onReady": onPlayerReady,
    //             "onStatChange": OnStatChange,
    //         }
    //     })
    // }
	// function OnSubmitVideoInformation(e) {
    //     e.preventDefault();
    //     let url = new URL(e.target["video-id"].value);
    //     let videoId = url.search.split("?")[1].split("&")[0].split("=")[1];

    //     LoadNewVideo(videoId);
	// };
	// function OnStatChange(e) {
    //     e.target.playVideo();
    // }

    // import Relayer from './MediaRelayer.svelte';
</script>
 -->

<script>
    import Relayer from './Relayer.svelte';
    import Lobby from './Lobby.svelte';
    import GameRoom from './GameRoom/GameRoom.svelte';
    import Main from './Main.svelte';
</script>

<main>
    <div class="container">
        <Lobby></Lobby>
        <!-- <GameRoom></GameRoom> -->
        <!-- <Main></Main> -->
    </div>
</main>
 
<!-- 
<main>
    <div class="wrap"> -->
            <!-- <div id="player-wrap"></div>
            <p>
                <span>test case url :: </span>
                <br>https://www.youtube.com/watch?v=pKv_wua6kFE
                <br><br>
                <span>list test case url ::</span>
                <br>https://www.youtube.com/watch?v=3GWscde8rM8&list=PLd6UgfNCWmp8bnixMcfgv_wcSMN_niBqx
            </p>
            <div class="form-wrap-video-information">
                <form class="form-video-information" on:submit="{OnSubmitVideoInformation}">
                    <input name="video-id" type="text">
                    <input name="" type="submit" value="제출">
                </form>
            </div>
            <div class="linked-wrap">
                <Relayer></Relayer>
            </div> -->
    <!-- </div>
</main>

 
<style>
    main {
        display: flex;
        width: 100%;
        height: 100%;
        align-items: center;
    }
    .container {
        flex-basis: 100%;
    }
</style>
-->
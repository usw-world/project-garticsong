<script>
    let videoPlayerElmt;
    
    function OnYouTubeIframeAPIReady() {
        console.log("Youtube API got ready");
    }
    // test-case 
    // https://www.youtube.com/watch?v=pKv_wua6kFE
    // pKv_wua6kFE

    // list test-case
    // https://www.youtube.com/watch?v=3GWscde8rM8&list=PLd6UgfNCWmp8bnixMcfgv_wcSMN_niBqx
    // 3GWscde8rM8
    function LoadNewVideo(_videoId) {
        const CHILD_ID = "youtube-video-player";
        if(document.querySelector(`#${CHILD_ID}`)) {
            document.querySelector("#player-wrap").removeChild(document.querySelector(`#${CHILD_ID}`));
        }

        let child = document.createElement("div");
        child.id = CHILD_ID;
        document.querySelector("#player-wrap").appendChild(child);
        videoPlayerElmt = new YT.Player(CHILD_ID, {
            videoId: _videoId,
			width: 0,
			height: 0,
            events: {
                // "onReady": onPlayerReady,
                "onStatChange": OnStatChange,
            }
        })
    }
	function OnSubmitVideoInformation(e) {
        e.preventDefault();
        let url = new URL(e.target["video-id"].value);
        let videoId = url.search.split("?")[1].split("&")[0].split("=")[1];

        LoadNewVideo(videoId);
	};
	function OnStatChange(e) {
        e.target.playVideo();
    }

    function OnSubmit(e) {
        console.dir(e.target.title.value);
    }
    function OnClickInputArea() {
        
    }
</script>

<div class="question-wrap" on:submit|preventDefault="{OnSubmit}">
    <form class="question-form">
        <div class="input-area" on:click="{OnClickInputArea()}">
            <input type="text" name="url" placeholder="" autocomplete="off">
        </div>
        <div class="input-area" on:click="{OnClickInputArea()}">
            <input type="text" name="title" placeholder="" autocomplete="off" disabled>
        </div>
        <div class="input-area" on:click="{OnClickInputArea()}">
            <textarea name="description" class="input-description" placeholder="" autocomplete="off" disabled></textarea>
        </div>
        <div class="input-area" on:click="{OnClickInputArea()}">
            <textarea name="hint" class="input-description" autocomplete="off" disabled></textarea>
        </div>
        <input class="button" type="submit" value="제출">
        <!-- <button class="edit-button"><img src="../images/recycle-b.svg" alt=""></button> -->
    </form>
</div>

<style>
    /* .edit-button {
        width: 6rem;
    } */
    .input-description {
        height: 10rem;
    }
</style>
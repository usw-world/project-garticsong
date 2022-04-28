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
</script>

<div class="question-wrap" on:submit|preventDefault="{OnSubmit}">
    <form class="question-form">
        <input type="text" name="url" placeholder="영상 링크" autocomplete="off">
        <input type="text" name="title" placeholder="노래 제목" disabled>
        <textarea name="description" disabled></textarea>
        <textarea name="hint" disabled></textarea>
        <input class="button" type="submit" value="제출">
        <button class="edit-button"><img src="../images/recycle-b.svg" alt=""></button>
    </form>
</div>

<style>
    img {
        vertical-align: middle;
    }
    textarea:disabled,
    input:disabled {
        background-color: rgba(255, 255, 255, .6);
    }
    textarea:disabled::placeholder,
    input:disabled::placeholder {
        color: #777;
    }
    button,
    input,
    textarea {
        height: 5rem;
        padding: 0 1.5rem;
        color: #fff;
        font-size: 2.2rem;
        font-weight: 900;
        font-family: nsr;
        border: .3rem solid #fff;
        background-color: rgba(255, 255, 255, .25);
        border-radius: 2.5rem;
        box-sizing: border-box;
        vertical-align: middle;
        outline: none;
    }
    input::placeholder,
    textarea::placeholder {
        color: #888;
        font-weight: 700;
    }
    button,
    input.button {
        color: #232323;
        border: .3rem solid #232323;
        background-color: rgba(255, 255, 255, 1);
    }
    button:active,
    input.button:active{
        background-color: rgba(211, 211, 211, 1);
    }
    .edit-button {
        width: 6rem;

    }
    input {

    }
    textarea {
        resize: none;
    }
</style>
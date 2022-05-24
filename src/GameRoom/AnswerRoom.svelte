<script>
    import { onMount } from "svelte";
    export let answerObj;
    console.log(answerObj);
    let hint = answerObj.description;
    let value, videoPlayerElmt;
    let url = answerObj.videoInfo;
    let answerInput;
    let disabled = false;

    // setTimeout(() => {

    // }, 3000);
    onMount(() => {
        disabled = true;
        LoadNewVideo(url);
    });
    function LoadNewVideo(url) {
        const CHILD_ID = "youtube-video-player";
        if(document.querySelector(`#${CHILD_ID}`)) {
            document.querySelector("#player-wrap").removeChild(document.querySelector(`#${CHILD_ID}`));
        }
        let child = document.createElement("div");
        child.id = CHILD_ID;
        console.log(url);
        document.querySelector("#player-wrap").appendChild(child);
        videoPlayerElmt = new YT.Player(CHILD_ID, {
            videoId: url,
			// width: 0,
			// height: 0,
            events: {
                // "onReady": onPlayerReady,
                // "onStatChange": OnStatChange,
            }
        });
    }
    function OnStatChange(e) {
        e.target.playVideo();
      }

    function OnSubmit(e){
        value = e.target.answer.value;
        console.log(value);
        console.log(answerObj.title);
        
        if ( value === answerObj.title){
            OnAnswerInput();
        }
        else {
            OnInputError();
        }
    }
    function OnInputError() {
        answerInput.style.animation = "inputError 400ms ease 1 forwards";
    }
    function ResetInput() {
        answerInput.style.animation = "none";
    }
    function OnAnswerInput() {
        answerInput.style.animation = "inputAnswer 400ms ease 1 forwards";
    }
</script>

<form class="question-form" on:submit|preventDefault = {OnSubmit}>
    <div id="player-wrap"></div>
    <div class="input-wrap">
        {#if !disabled}
            <div class="answer-described">곡 설명! <br>{hint}</div>
            
        {:else}
            <div class="answer-request">정답을 입력하세요!</div>
            <input type="text" class="answer-answer" name="answer" bind:this={answerInput} on:focus={ResetInput} autocomplete="off"><br />
            <input id="answer-submit-button" class="answer-button" type="submit" value="제출">
        {/if}
    </div>
</form>

<style>
    .question-form{
        transition: 400ms ease opacity;
        height: 100%;
    }
    .input-wrap {
        position: relative;
        display: flex;
        width: 100%;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .answer-described {
        font-size: 3rem;
        font-weight: 900;
        text-align: center;
        line-height: 3;
    }
    .answer-request{
        margin-bottom: 1.8rem;
        font-size: 3rem;
        font-weight: 900;
        text-align: center;
        line-height: 1.45;
    }
    .answer-answer {
        display: inline-block;
        padding: 1rem 0;
        height: auto;

    }
    .answer-answer {
        transition: color 400ms ease;
        text-align: center;
        padding: 1rem;
        margin-bottom: 3rem;
        overflow: hidden;
        width: 40rem;
        resize: none;
        overflow: hidden;
        /* animation: inputError 400ms ease 1 forwards; */
    }
    input[type="submit"] {
        display: inline-block;
        padding: 1rem 2rem;
    }
</style>
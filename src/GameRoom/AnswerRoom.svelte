<script>
    import { onMount } from "svelte";
    import VideoPlayer from "./VideoPlayer.svelte";
    export let question;
    console.dir(question);
    let answerInput;
    let showingInput = false;
    onMount(() => {
        setTimeout(() => {
            showingInput = true;
            answerInput.focus();
        }, 3000);
    });
    function OnSubmit(e){
        let value = e.target.answer.value;
        console.log(value);
        console.log(question.title);
        if (value === question.title){
            OnGuess();
        } else {
            OnInputError();
        }
    }
    function OnInputError() {
        answerInput.style.animation = "inputError 400ms ease 1 forwards";
    }
    function ResetInput() {
        answerInput.style.animation = "none";
    }
    function OnGuess() {
        answerInput.style.animation = "inputAnswer 400ms ease 1 forwards";
    }
</script>

<form class="question-form" on:submit|preventDefault = {OnSubmit}>
    <div class="input-wrap" style="
        height: {showingInput ? "23" : "0"}%;
        opacity: {showingInput ? "1" : "0"};
        margin-top: {showingInput ? "10" : "3"}rem;
    ">
        <VideoPlayer videoId={question.videoInfo.videoId} />
        <div class="answer-request">정답을 입력하세요!</div>
        <input type="text" class="answer-answer" name="answer" bind:this={answerInput} on:focus={ResetInput} autocomplete="off"><br />
        <!-- <input id="answer-submit-button" class="answer-button" type="submit" value="제출"> -->
    </div>
    <div class="answer-description">{question.description}</div>
</form>

<style>
    .question-form{
        transition: 400ms ease opacity;
        height: 100%;
    }
    .input-wrap {
        transition: height 400ms ease,
                    margin 400ms ease,
                    opacity 400ms ease;
        position: relative;
        width: 100%;
        height: 0%;
        flex-direction: column;
        text-align: center;
        overflow: hidden;
    }
    .answer-description {
        width: 60%;
        max-height: 45%;
        padding: 3rem;
        margin: 0 auto 2.5rem;
        font-size: 3rem;
        font-weight: 900;
        text-align: center;
        border: .8rem solid rgba(255, 255, 255, .1);
        /* background-color: rgba(255, 255, 255, .1); */
        border-radius: 2.4rem;
        line-height: 1.4;
        box-sizing: border-box;
        overflow: hidden;
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
        border-width: .8rem;
    }
    .answer-answer {
        transition: color 400ms ease;
        text-align: center;
        width: 56rem;
        height: 5rem;
        padding: 1rem;
        margin-bottom: 3rem;
        overflow: hidden;
        overflow: hidden;
    }
    /* input[type="submit"] {
        display: inline-block;
        padding: 1rem 2rem;
    } */
</style>
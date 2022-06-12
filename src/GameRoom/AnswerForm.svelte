<script>
    import { PlayAudio, game } from "../store";
    let thisGame;
    game.subscribe(value => {
        thisGame = value;
    })
    import { onMount } from "svelte";
    import VideoPlayer from "./VideoPlayer.svelte";

    export let OnReady;
    export let startRound;
    export let endRound;
    export let SubmitAnswer;
    export let showHint;
    console.dir(thisGame.room.currentQuestion);
    let answerInput;
    let showingInput = false;
    onMount(() => {
        PlayAudio("/soundEffects/start-question.wav");
    });
    function OnRoundStart() {
        showingInput = true;
        answerInput.focus();
    }
    function OnRoundEnd() {
        setTimeout(() => {
            showingInput = false;
        }, 1000);
    }
    function OnSubmit(e){
        let value = e.target.answer.value;
        value = value.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/ ]/gim, "");
        if(value === thisGame.room.currentQuestion.title) {
            OnGuess(value);
        } else {
            OnInputError();
        }
        e.target.answer.value = "";
    }
    function OnInputError() {
        answerInput.style.animation = "inputError 400ms ease 1 forwards";
    }
    function ResetInputStatus() {
        answerInput.style.animation = "none";
    }
    function OnGuess(title) {
        SubmitAnswer(title);
    }

</script>

<form class="question-form" on:submit|preventDefault = {OnSubmit}>
    <div class="input-wrap" style="
        height: {showingInput ? "23" : "0"}%;
        opacity: {showingInput ? "1" : "0"};
        margin-top: {showingInput ? "10" : "3"}rem;
    ">
        <VideoPlayer 
            OnReady={OnReady} 
            videoId={thisGame.room.currentQuestion.videoInfo.videoId} 
            startRound={startRound}
            endRound={endRound}
            OnRoundStart={OnRoundStart}
            OnRoundEnd={OnRoundEnd}
        />
        <div class="answer-request">정답을 입력하세요!</div>
        <input type="text" class="answer-answer" name="answer" bind:this={answerInput} 
            on:focus="{ResetInputStatus}"
            on:input="{ResetInputStatus}"
            autocomplete="off"
        >
        <input id="answer-submit-button" class="answer-button" type="submit" value="확인">
    </div>
    <div class="answer-description">
        <div class="author">{thisGame.room.currentQuestion.author.name}의 문제</div>
        {thisGame.room.currentQuestion.description}
    </div>
    {#if {showHint} != true}
        <div class="hint-submit-answer">호스트가 힌트를 제출할 때 까지 기다려요!<br /></div>
    {:else if showHint == true}
        <div class="hint-submit-answer">힌트! <br> {thisGame.room.currentQuestion.hint}</div>
    {/if}
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
        font-size: 0;
    }
    .answer-description {
        width: 60%;
        max-height: 45%;
        padding: 3rem;
        margin: 0 auto 2.5rem;
        font-size: 2.5rem;
        font-weight: 400;
        text-align: center;
        border: .5rem solid rgba(255, 255, 255, .1);
        /* background-color: rgba(255, 255, 255, .1); */
        border-radius: 2.4rem;
        line-height: 1.4;
        box-sizing: border-box;
        overflow: hidden;
    }
    .answer-description>.author {
        font-weight: 900;
        font-size: 1.9rem;
        margin-bottom: 1.2rem;
    }
    .answer-description>.author::after {
        content: "";
        margin: 0 auto;
        display: block;
        width: 2em;
        height: 0.5rem;
        margin-top: 1.2rem;
        background-color: rgba(255, 255, 255, 1);
        border-radius: .25rem;
    }
    .answer-request{
        margin-bottom: 1.8rem;
        font-size: 3rem;
        font-weight: 900;
        text-align: center;
    }
    .answer-answer {
        transition: color 400ms ease;
        display: inline-block;
        width: 56rem;
        height: 6.6rem;
        margin-bottom: 3rem;
        padding: 1rem;
        font-size: 2.2rem;
        text-align: center;
        border-right: 0;
        border-width: .3rem;
        border-radius: 3.3rem 0 0 3.3rem;
        overflow: hidden;
        vertical-align: middle;
    }
    input[type="submit"] {
        display: inline-block;
        height: 6.6rem;
        margin-bottom: 3rem;
        padding: 1rem 2rem;
        font-size: 2.2rem;
        letter-spacing: .2rem;
        border-left: 0;
        border-width: .3rem;
        border-radius: 0 3.3rem 3.3rem 0;
        vertical-align: middle;
        cursor: pointer;
    }
</style>